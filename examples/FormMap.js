import React, { Component } from 'react';

import { View, StyleSheet, TouchableOpacity, Text, TextInput } from 'react-native';

export default class FormMap extends Component {
  state = {
    open: false,
    from: '',
    to: '',
    navigate: false
  }

  openForm = () => this.setState({ open: true })

  onSubmit = () => {
    this.setState({
      navigate: true
    })
    this.props.onSubmit({
      from: this.state.from,
      to: this.state.to
    })
  }

  onReset = () => {
    this.setState({
      navigate: false,
      open: false,
      from: '',
      to: ''
    })
  }

  onChangeText = (key, value) => {
    this.setState({ [key]: value })
  }

  render() {
    const { from, to, navigate, open } = this.state
    const classButton = open ? styles.button_open : styles.button
    const classWrapper = open ? styles.wrapper_open : styles.wrapper
    return (
      <View style={styles.flex}>
        <View style={classWrapper}>
          <TouchableOpacity style={classButton} onPress={this.openForm}>
            <Text style={styles.tile_text}>New Route</Text>
          </TouchableOpacity>
          {open && <View style={styles.form}>
            <TextInput
              style={styles.TextInput}
              onChangeText={text => this.onChangeText('from', text)}
              value={from}
            />
            <TextInput
              style={styles.TextInput}
              onChangeText={text => this.onChangeText('to', text)}
              value={to}
            />
            {!navigate && <TouchableOpacity style={styles.button_form} onPress={this.onSubmit}>
              <Text style={styles.button_text}>Route</Text>
            </TouchableOpacity>}
          </View>}
        </View>
        {navigate && <View style={styles.button_navigate}>
          <TouchableOpacity style={styles.button_touch} onPress={this.onReset}>
            <Text style={styles.tile_text}>NAVIGATE</Text>
          </TouchableOpacity>
        </View>}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  flex: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    width: '40%',
    flexDirection: 'column',
  },
  wrapper_open: {
    backgroundColor: '#35628B',
    width: '80%',
    flexDirection: 'column',
    borderRadius: 5,
    paddingTop: 10
  },
  button: {
    backgroundColor: '#35628B',
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 20,
    paddingLeft: 20,
    fontSize: 18,
    borderRadius: 20,
    alignItems: "center",
  },
  button_open: {
    width: '100%',
    alignItems: "center",
  },
  tile_text: {
    color: 'white',
    fontSize: 15
  },
  TextInput:  {
    height: 30,
    borderColor: '#35628B',
    borderWidth: 1,
    width: '95%',
    marginTop: 5,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 5,
    paddingRight: 5,
  },
  form: {
    paddingBottom: 10,
    alignItems: "center",
  },
  button_form: {
    backgroundColor: '#2b3d5d',
    marginTop: 10,
    width: '95%',
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 5
  },
  button_text: {
    color: 'white',
  },
  button_navigate: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 5,
    width: '60%'
  },
  button_touch: {
    backgroundColor: '#0c898b',
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 18,
    borderRadius: 10,
    width: '100%',
    alignItems: "center",
  },
  button_navi_text: {
    color: 'white',
    fontSize: 20
  }
});
