import React, { Component } from 'react';

import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import carImage from './assets/car.png';
import MapViewDirections from './Directions'
import FormMap from './FormMap'


export default class NavigationMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevPos: null,
      curPos: { latitude: 37.785834, longitude: -122.406417 },
      carPos: { latitude: 37.785834, longitude: -122.406417 },
      navigation: {
        from: {
          latitude: null,
          longitude: null,
        },
        to: {
          latitude: null,
          longitude: null
        }
      },
      curAng: 45,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    this.changePosition = this.changePosition.bind(this);
    this.getRotation = this.getRotation.bind(this);
    this.updateMap = this.updateMap.bind(this);
  }

  onMapReady() {
    Geolocation.watchPosition((position) => {
      this.setState({
        carPos: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
      })

    }, (error) =>console.log(error));
  }

  componentDidMount() {
    // Geolocation.getCurrentPosition((position) => {
    //   this.setState({
    //     prevPos: this.state.curPos,
    //     curPos: {
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.longitude,
    //     },
    //   });

    // }, (error) =>console.log(error));
  }

  componentWillUnmount() {
    //
  }

  changePosition(latOffset, lonOffset) {
    const latitude = this.state.curPos.latitude + latOffset;
    const longitude = this.state.curPos.longitude + lonOffset;
    this.setState({
      prevPos: this.state.curPos,
      curPos: { latitude, longitude },
    });
    this.updateMap();
  }

  getRotation(prevPos, curPos) {
    if (!prevPos) {
      return 0;
    }
    const xDiff = curPos.latitude - prevPos.latitude;
    const yDiff = curPos.longitude - prevPos.longitude;
    return (Math.atan2(yDiff, xDiff) * 180.0) / Math.PI;
  }

  updateMap() {
    const { curPos, prevPos, curAng } = this.state;
    const curRot = this.getRotation(prevPos, curPos);
    this.map.animateCamera({ heading: curRot, center: curPos, pitch: curAng });
  }

  onSubmit = (data) => {
    const navigation = {
      from: {
        latitude: parseFloat(data.from.split(',')[0]),
        longitude: parseFloat(data.from.split(',')[1]),
      },
      to: {
        latitude: parseFloat(data.to.split(',')[0]),
        longitude: parseFloat(data.to.split(',')[1]),
      },
    }

    this.setState({
      navigation: navigation
    })
  }

  render() {
    return (
      <View style={styles.flex}>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={el => (this.map = el)}
          style={styles.flex}
          minZoomLevel={15}
          // region={{
          //   ...this.state.curPos,
          //   latitudeDelta: this.state.latitudeDelta,
          //   longitudeDelta: this.state.longitudeDelta,
          // }}
          initialCamera={{
            center: this.state.curPos,
            heading: 90,
            pitch: 45,
            altitude: 100,
            zoom: 25,
          }}
          onMapReady={this.onMapReady()}
        >
          <MapView.Marker
            coordinate={
              this.state.carPos
            }
            anchor={{ x: 0.5, y: 0.5 }}
            image={carImage}
          />
          {(
            this.state.navigation.from.latitude &&
            this.state.navigation.from.longitude &&
            this.state.navigation.to.latitude &&
            this.state.navigation.to.longitude
          ) && <MapViewDirections
            origin={this.state.navigation.from}
            destination={this.state.navigation.to}
            apikey="AIzaSyC6Nk_PFcJ2ucfRJ4C8-4sqVNyN9d-q61I"
          />}
        </MapView>
        <View style={styles.buttonContainerUpDown}>
          <TouchableOpacity
            style={[styles.button, styles.up]}
            onPress={() => this.changePosition(0.0001, 0)}
          >
            <Text>+ Lat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.down]}
            onPress={() => this.changePosition(-0.0001, 0)}
          >
            <Text>- Lat</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainerLeftRight}>
          <TouchableOpacity
            style={[styles.button, styles.left]}
            onPress={() => this.changePosition(0, -0.0001)}
          >
            <Text>- Lng</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.right]}
            onPress={() => this.changePosition(0, 0.0001)}
          >
            <Text>+ Lng</Text>
          </TouchableOpacity>
        </View>
        {(
          !this.state.navigation.from.latitude &&
          !this.state.navigation.from.longitude &&
          !this.state.navigation.to.latitude &&
          !this.state.navigation.to.longitude
        ) && <FormMap currentPosition={this.state.curPos} onSubmit={this.onSubmit} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    width: '100%',
  },
  buttonContainerUpDown: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonContainerLeftRight: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'rgba(100,100,100,0.2)',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    height: 50,
    width: 50,
  },
  up: {
    alignSelf: 'flex-start',
  },
  down: {
    alignSelf: 'flex-end',
  },
  left: {
    alignSelf: 'flex-start',
  },
  right: {
    alignSelf: 'flex-end',
  },
});
