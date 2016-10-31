/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const TILE_SIZE = 20;
const BOARD_WIDTH = (Dimensions.get('window').width - 20) - (Dimensions.get('window').width % TILE_SIZE);
const BOARD_HEIGHT = (Dimensions.get('window').height - 60) - (Dimensions.get('window').height % TILE_SIZE);

class Tile extends Component {
  constructor(props) {
    super(props);

    this.onTileChange = this.onTileChange.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    // Update component only if cell's value changed
    return (this.props.value !== nextProps.value);
  }

  onTileChange () {
    this.props.handleTileTouch(this.props.x, this.props.y);
  }

  render () {
    let style = this.props.value ? styles.tileActive : styles.tileUnactive;
    return (
      <TouchableOpacity onPress={this.onTileChange}>
        <View style={style}></View>
      </TouchableOpacity>
    );
  }
}

class Row extends Component {
  render () {
    return (
      <View style={styles.row}>
        {
          this.props.rowArr.map( (element, index) =>
            <Tile
              key={index}
              value={this.props.rowArr[index]}
              x={this.props.x}
              y={index}
              handleTileTouch={this.props.handleTileTouch}
            />
          )
        }
      </View>
    );
  }
}

class Board extends Component {
  render() {
    return (
      <View style = {styles.board}>
        {
          this.props.grid.map((element, index) =>
            <Row
              rowArr={element}
              key={index}
              x={index}
              handleTileTouch={this.props.handleTileTouch}
            />)
        }
      </View>
    );
  }
}

const Button = (props) => (
  <TouchableOpacity onPress = {props.onPress}>
    <View style={props.style}>
      <Text style={props.textStyle}> {props.text} </Text>
    </View>
  </TouchableOpacity>
);

class ToolsBar extends Component {
  render() {
    return (
      <View style = {styles.toolsBar}>
        <Button onPress={this.props.handleReset} style={styles.tool} textStyle={styles.toolText} text={'Reset'} />
        <Button onPress={this.props.handleRandom} style={styles.tool} textStyle={styles.toolText} text={'Random'} />
        <Button onPress={this.props.handlePause} style={styles.tool} textStyle={styles.toolText} text={'Pause'} />
        <Button onPress={this.props.handleRun} style={styles.tool} textStyle={styles.toolText} text={'Play'} />
      </View>
    )
  }
}

export default class Conways extends Component {
  constructor(props) {
    super(props);

    this.state = {
      grid: this.getEmptyGrid(),
    };

    this.handleTileTouch = this.handleTileTouch.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleRun = this.handleRun.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleRandom = this.handleRandom.bind(this);
    this.getEmptyGrid = this.getEmptyGrid.bind(this);
  }

  getEmptyGrid() {
    let grid = [];

    for (let x = 0; x < BOARD_HEIGHT / TILE_SIZE; x++) {
      grid[x] = [];
      for (let y = 0; y < BOARD_WIDTH / TILE_SIZE; y++) {
        grid[x][y] = false;
      }
    }
    return grid;
  }

  getNextGrid() {
    let newArray = [];

    for (let i = 0; i < BOARD_HEIGHT / TILE_SIZE; i++) {
      let row = [];
      for (let j = 0; j < BOARD_WIDTH / TILE_SIZE; j++) {
        row.push(this.willCellSurvive(this.state.grid, i, j) ? 1 : 0);
      }
      newArray.push(row);
    }
    return newArray;
  }

  willCellSurvive(grid, x, y) {
    let neighbors = 0;

    /**
    * count living cells arond the targeted cell
    */
    if (grid[mod(x + 1, BOARD_HEIGHT / TILE_SIZE)][y]) neighbors++;
    if (grid[mod(x + 1, BOARD_HEIGHT / TILE_SIZE)][mod(y + 1, BOARD_WIDTH / TILE_SIZE)]) neighbors++;
    if (grid[x][mod(y + 1, BOARD_WIDTH / TILE_SIZE)]) neighbors++;
    if (grid[x][mod(y - 1, BOARD_WIDTH / TILE_SIZE)]) neighbors++;
    if (grid[mod(x + 1, BOARD_HEIGHT / TILE_SIZE)][mod(y - 1, BOARD_WIDTH / TILE_SIZE)]) neighbors++;
    if (grid[mod(x - 1, BOARD_HEIGHT / TILE_SIZE)][y]) neighbors++;
    if (grid[mod(x - 1, BOARD_HEIGHT / TILE_SIZE)][mod(y - 1, BOARD_WIDTH / TILE_SIZE)]) neighbors++;
    if (grid[mod(x - 1, BOARD_HEIGHT / TILE_SIZE)][mod(y + 1, BOARD_WIDTH / TILE_SIZE)]) neighbors++;

    return (grid[x][y] && neighbors == 2 || neighbors == 3);

    function mod(x, m) {
      m = Math.abs(m);
      return (x % m + m) % m;
    }
  }

/*----------------------------HANDLERS--------------------------------------*/
  handleTileTouch(x, y) {
    let newArray = this.state.grid;

    newArray[x][y] = !newArray[x][y];
    this.setState({grid: newArray});
  }

  handleReset() {
    this.setState({ grid: this.getEmptyGrid() });
  }

  handleRandom() {
    let newArray = [];

    for (let x = 0; x < BOARD_HEIGHT / TILE_SIZE; x++) {
      newArray[x] = [];
      for (let y = 0; y < BOARD_WIDTH / TILE_SIZE; y++) {
        newArray[x][y] = (Math.random() >= 0.80);
      }
    }

    this.setState({ grid: newArray });
  }

  handleRun() {
    if (!this.timer) {
      this.timer = setInterval(() => this.setState({grid: this.getNextGrid()}), 50);
    }
  }

  handlePause() {
    clearInterval(this.timer);
    this.timer = null;
  }

  render() {
    return (
      <View style={styles.container}>
        <Board
          grid={this.state.grid}
          handleTileTouch={this.handleTileTouch}
        />
        <ToolsBar
          grid={this.state.grid}
          handleReset={this.handleReset}
          handleRandom={this.handleRandom}
          handleRun={this.handleRun}
          handlePause={this.handlePause}
        />
      </View>
    );
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
  },
});

AppRegistry.registerComponent('Conways', () => Conways);
