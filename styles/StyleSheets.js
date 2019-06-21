import React from 'react';
import {
  StyleSheet,
} from 'react-native';

export default class StyleSheets {
  static Container = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    downward: {
      flexDirection: 'column',
      flex: 1
    }
  });
  static Error = StyleSheet.create({
    text: {
      color: 'red',
      fontSize: 15,
      textAlign: 'center',
    },
  });
  static HeaderText = StyleSheet.create({
    mainTitle: {
      fontSize: 30,
      textAlign: 'center',
      justifyContent: 'center'
    },
    subTitle: {
      fontSize: 25
    }
  });
  static Info = StyleSheet.create({
    text: {
      color: 'black',
      fontSize: 20
    },
  });
  static Main = StyleSheet.create({
    container: {
      borderWidth: 10,
      borderColor: 'white',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
    },
  });
  static LoginBox = StyleSheet.create({
    box: {
      height: 40,
      width: 250,
    },
    text: {
      fontSize: 18
    },
  });
  static Input = StyleSheet.create({
    box: {
      width: 300,
      height: 50,
      borderColor: 'black',
      borderWidth: 5
    },
    text: {
      fontSize: 15,
      padding: 10
    }

  })
}