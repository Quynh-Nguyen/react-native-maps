import React, { Component } from 'react';

import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import MapView, { Polyline } from 'react-native-maps';
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
      curAng: 45,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    this.changePosition = this.changePosition.bind(this);
    this.getRotation = this.getRotation.bind(this);
    this.updateMap = this.updateMap.bind(this);
  }

  componentDidMount() {
    Geolocation.getCurrentPosition((position) => {
      this.setState({
        prevPos: this.state.curPos,
        curPos: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
      });
      this.updateMap();
    }, (error) =>console.log(error));

    Geolocation.watchPosition((position) => {
      this.setState({
        carPos: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
      });
      this.updateMap();
    }, (error) =>console.log(error));
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
    console.log('data ', data)
  }

  render() {
    return (
      <View style={styles.flex}>
        <MapView
          ref={el => (this.map = el)}
          style={styles.flex}
          minZoomLevel={15}
          region={{
            ...this.state.curPos,
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta,
          }}
          camera={{
            center: this.state.curPos,
            heading: 90,
            pitch: 45,
            altitude: 100,
            zoom: 25,
          }}
        >
          <MapView.Marker
            coordinate={
              this.state.carPos
            }
            anchor={{ x: 0.5, y: 0.5 }}
            image={carImage}
          />
          <MapViewDirections
            origin={this.state.curPos}
            destination={{
              latitude: this.state.curPos.latitude + 5,
              longitude: this.state.curPos.longitude + 5
            }}
            apikey="AIzaSyC6Nk_PFcJ2ucfRJ4C8-4sqVNyN9d-q61I"
          />
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
        <FormMap onSubmit={this.onSubmit} />
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
