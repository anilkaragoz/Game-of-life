/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/

import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'

const BOARD_WIDTH = 360
const BOARD_HEIGHT = 600
const TILE_SIZE = 20

class Tile extends Component {
  constructor(props) {
    super(props)

    this.onTileChange = this.onTileChange.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    //Update component only if cell's value changed
    return (this.props.value !== nextProps.value)
  }

  onTileChange () {
    this.props.handleTileTouch(this.props.x, this.props.y)
  }

  render () {
    let style = this.props.value ? styles.tileActive : styles.tileUnactive
    return (
      <TouchableOpacity onPress={this.onTileChange}>
        <View style={style}></View>
      </TouchableOpacity>
    )
  }
}

class Row extends Component {
  render () {
    return (
      <View style={styles.row}>
        {
          this.props.rowArr.map(
            (element, index) => <Tile key = {index} value = {this.props.rowArr[index]} x = {this.props.x} y = {index} handleTileTouch = {this.props.handleTileTouch}/>
          )
        }
      </View>
    )
  }
}

class Board extends Component {
  render() {
    return (
      <View style = {styles.board}>
        {
          this.props.grid.map(
            (element, index) => <Row rowArr = {element} key={index} x = {index} handleTileTouch = {this.props.handleTileTouch}/>)
        }
      </View>
    )
  }
}

class ResetButton extends Component {
  constructor(props) {
    super(props)

    this.onReset = this.onReset.bind(this)
  }

  onReset() {
    this.props.handleReset()
  }

  render() {
    return (
      <TouchableOpacity onPress = {this.onReset}>
        <View style = {styles.tool}>
          <Text style = {styles.toolText}>Reset</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

class RandomButton extends Component {
  constructor(props) {
    super(props)

    this.onRandom = this.onRandom.bind(this)
  }

  onRandom() {
    this.props.handleRandom()
  }

  render() {
    return (
      <TouchableOpacity onPress = {this.onRandom}>
        <View style = {styles.tool}>
          <Text style = {styles.toolText}>Random</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

class PauseButton extends Component {
  constructor(props) {
    super(props)

    this.onPause = this.onPause.bind(this)
  }

  onPause() {
    this.props.handlePause()
  }

  render() {
    return (
      <TouchableOpacity onPress = {this.onPause}>
        <View style = {styles.tool}>
          <Text style = {styles.toolText}>Pause</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

class PlayButton extends Component {

  constructor(props) {
    super(props)

    this.onRun = this.onRun.bind(this)
  }

  onRun() {
    this.props.handleRun()
  }

  render() {
    return (
      <TouchableOpacity onPress = {this.onRun}>
        <View style = {styles.tool}>
          <Text style = {styles.toolText}>Play</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

class ToolsBar extends Component {
  render() {
    return (
      <View style = {styles.toolsBar}>
      <ResetButton grid = {this.props.grid} handleReset = {this.props.handleReset}/>
      <RandomButton grid = {this.props.grid} handleRandom = {this.props.handleRandom}/>
      <PauseButton handlePause = {this.props.handlePause}/>
      <PlayButton handleRun = {this.props.handleRun}/>
      </View>
    )
  }
}

export default class Conways extends Component {
  constructor(props) {
    super(props)

    this.state = {
      grid: this.getEmptyGrid(),
    }

    this.handleTileTouch = this.handleTileTouch.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.handleRun = this.handleRun.bind(this)
    this.handlePause = this.handlePause.bind(this)
    this.handleRandom = this.handleRandom.bind(this)
    this.getEmptyGrid = this.getEmptyGrid.bind(this)
  }

  getEmptyGrid() {
    let grid = []

    for (let x = 0; x < BOARD_HEIGHT / TILE_SIZE; x++)
    {
      grid[x] = []
      for (let y = 0; y < BOARD_WIDTH / TILE_SIZE; y++) {
        grid[x][y] = false
      }
    }
    return grid
  }

  getNextGrid() {
    let newArray = []

    for (let i = 0; i < BOARD_HEIGHT / TILE_SIZE; i++) {
      let row = []
      for (let j = 0; j < BOARD_WIDTH / TILE_SIZE; j++) {
        row.push(this.willCellSurvive(this.state.grid, i, j) ? 1 : 0)
      }
      newArray.push(row)
    }
    return newArray
  }

  willCellSurvive(grid, x, y) {
    let neighbors = 0

    /**
    * count living cells arond the targeted cell
    */
    if (grid[mod(x + 1, BOARD_HEIGHT / TILE_SIZE)][y]) neighbors++
    if (grid[mod(x + 1, BOARD_HEIGHT / TILE_SIZE)][mod(y + 1, BOARD_WIDTH / TILE_SIZE)]) neighbors++
    if (grid[x][mod(y + 1, BOARD_WIDTH / TILE_SIZE)]) neighbors++
    if (grid[x][mod(y - 1, BOARD_WIDTH / TILE_SIZE)]) neighbors++
    if (grid[mod(x + 1, BOARD_HEIGHT / TILE_SIZE)][mod(y - 1, BOARD_WIDTH / TILE_SIZE)]) neighbors++
    if (grid[mod(x - 1, BOARD_HEIGHT / TILE_SIZE)][y]) neighbors++
    if (grid[mod(x - 1, BOARD_HEIGHT / TILE_SIZE)][mod(y - 1, BOARD_WIDTH / TILE_SIZE)]) neighbors++
    if (grid[mod(x - 1, BOARD_HEIGHT / TILE_SIZE)][mod(y + 1, BOARD_WIDTH / TILE_SIZE)]) neighbors++

    return (grid[x][y] && neighbors == 2 || neighbors == 3)

    function mod(x, m) {
      m = Math.abs(m)
      return (x % m + m) % m
    }
  }

/*----------------------------HANDLERS--------------------------------------*/
  handleTileTouch(x, y) {
    let newArray = this.state.grid

    newArray[x][y] = !newArray[x][y]
    this.setState({grid: newArray})
  }

  handleReset() {
    this.setState({grid: this.getEmptyGrid()})
  }

  handleRandom() {
    let newArray = []

    for (let x = 0; x < BOARD_HEIGHT / TILE_SIZE; x++)
    {
      newArray[x] = []
      for (let y = 0; y < BOARD_WIDTH / TILE_SIZE; y++) {
        newArray[x][y] = (Math.random() >= 0.80)
      }
    }

    this.setState({grid: newArray})
  }

  handleRun() {
    if (!this.timer)
    {
      this.timer = setInterval(() => this.setState({grid: this.getNextGrid()}), 50)
    }
  }

  handlePause() {
    clearInterval(this.timer)
    this.timer = null
  }

  render() {
    return (
      <View style = {styles.container}>
      <Board grid = {this.state.grid} handleTileTouch = {this.handleTileTouch}/>
      <ToolsBar grid = {this.state.grid} handleReset = {this.handleReset} handleRandom = {this.handleRandom} handleRun = {this.handleRun} handlePause = {this.handlePause}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  board: {
    marginTop: 20,
    backgroundColor: '#333333',
    width: BOARD_WIDTH,
    height: BOARD_HEIGHT,
  },
  row: {
    flexDirection: 'row',
    width: BOARD_WIDTH,
    height: BOARD_HEIGHT / (BOARD_HEIGHT / TILE_SIZE),
  },
  tileUnactive: {
    backgroundColor: '#222222',
    borderColor: "black",
    borderWidth: 1,
    width: TILE_SIZE,
    height: TILE_SIZE,
  },
  tileActive: {
    backgroundColor: 'white',
    borderColor: "black",
    borderWidth: 1,
    width: TILE_SIZE,
    height: TILE_SIZE,
  },
  toolsBar: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    width: BOARD_WIDTH,
    height: 30,
    marginTop: 5,
  },
  tool: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 25,
    width: 60,
    backgroundColor: '#222222',
  },
  toolText: {
    color: 'white',
  }
})

AppRegistry.registerComponent('Conways', () => Conways)
