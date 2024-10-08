// node_modules/react-native-tab-selector/index.js
import React, { PureComponent } from 'react'
import {
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
  Text,
  StyleSheet
} from 'react-native'

const COLORS = {
  backgroundColor: '#EFEFEF',
  shadowColor: '#E8E8E8',
  backgroundColorItem: '#fff',
  colorText: '#45484C'
}

const { width } = Dimensions.get('window')
export default class TabSelectorAnimation extends PureComponent {
  state = {
    active: 0,
    xTabOne: 0,
    xTabTwo: 0,
    translateX: new Animated.Value(0),
    translateXTabOne: new Animated.Value(0),
    translateXTabTwo: new Animated.Value(width),
    translateY: -1000
  }

  handleSlide = (type, index) => {
    const { onChangeTab } = this.props
    const { active, translateX, translateXTabOne, translateXTabTwo } =
      this.state
    if (onChangeTab) onChangeTab(index)
    Animated.timing(translateX, {
      toValue: this.state[type] || 0,
      delay: 0,
      duration: 200,
      useNativeDriver: false
    }).start()
    if (active === 0) {
      Animated.parallel([
        Animated.spring(translateXTabOne, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false
        }).start(),
        Animated.spring(translateXTabTwo, {
          toValue: width,
          duration: 100,
          useNativeDriver: false
        }).start()
      ])
    } else {
      Animated.parallel([
        Animated.spring(translateXTabOne, {
          toValue: -width,
          useNativeDriver: false,
          duration: 100
        }).start(),
        Animated.spring(translateXTabTwo, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false
        }).start()
      ])
    }
  }

  render() {
    const {
      tabs = [],
      style,
      styleTitle,
      backgroundColor,
      styleTab,
      selectedColor // Destructure selectedColor from props
    } = this.props
    const { translateX, active } = this.state
    return (
      <View
        style={[
          styles.container,
          style,
          {
            backgroundColor: backgroundColor || COLORS.backgroundColor
          }
        ]}
      >
        <Animated.View
          style={[
            styles.animatedView,
            {
              width: `${97 / tabs.length}%`,
              transform: [
                {
                  translateX
                }
              ]
            }
          ]}
        />
        {tabs.map((item, index) => (
          <TouchableOpacity
            key={item.title}
            style={[styles.tab, styleTab]}
            onLayout={(event) =>
              this.setState({
                [`xTab${index}`]: event.nativeEvent.layout.x
              })
            }
            onPress={() =>
              this.setState({ active: index }, () =>
                this.handleSlide(`xTab${index}`, index)
              )
            }
          >
            <Text
              style={[
                styles.textTitle,
                styleTitle,
                { color: active === index ? '#FF5A28' : COLORS.colorText },
                { fontWeight: active === index ? '700' : '400' }
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 58,
    height: 48,
    marginHorizontal: 20,
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  textTitle: {
    fontSize: 16,
    color: COLORS.colorText,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedView: {
    position: 'absolute',
    height: 40,
    marginHorizontal: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: COLORS.shadowColor,
    shadowRadius: 3,
    shadowOpacity: 1,
    backgroundColor: COLORS.backgroundColorItem,
    borderRadius: 45
  }
})

module.exports = TabSelectorAnimation
module.exports.default = TabSelectorAnimation
