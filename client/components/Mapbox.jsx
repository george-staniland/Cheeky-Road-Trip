import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import mapboxgl from 'mapbox-gl'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import bathroomData from '../../data/bathroom_data2.json'
import request from 'superagent'
import { addTripInstructions } from '../actions/currentTrip'
import { addNewTrip } from '../actions/currentTrip'

mapboxgl.accessToken = process.env.MAPBOX_API_KEY

class Mapbox extends React.Component {
  state = {
    changer: false,
    lng: this.props.currentTrip.START.longitude,
    lat: this.props.currentTrip.START.latitude,
    zoom: 5.75,
  }

  dostuff = () => {
    console.log('hello')
  }

  componentDidMount() {
    this.renderMap()
  }
  componentDidUpdate(prevProps) {
    if (prevProps.currentTrip.inbetweenWaypoints.length != this.props.currentTrip.inbetweenWaypoints.length) {
      this.renderMap()
    }
  }

  renderMap = () => {
    let start = [
      this.props.currentTrip.START.longitude,
      this.props.currentTrip.START.latitude
    ]
    let midCoords = ''
    this.props.currentTrip.inbetweenWaypoints.map((element) => {
      let newString = `${element.longitude},` + `${element.latitude};`
      midCoords = midCoords + newString
    })
    let end = [
      this.props.currentTrip.END.longitude,
      this.props.currentTrip.END.latitude
    ]

    let url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + start[0] + ',' + start[1] + ';' + midCoords + end[0] + ',' + end[1] + '?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken
    request.get(url)
      .then(res => {
        let instructionsArr = []
        res.body.routes[0].legs.map((element) => {
          element.steps.map((element) => {
            instructionsArr.push(element.maneuver.instruction)
          })
        })
        this.props.dispatch(addTripInstructions(instructionsArr))
      })

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/deriyaki/ckctmc2yt2xi01iplkz3px4bd',
      accessToken: process.env.MAPBOX_SKIN_KEY,
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    })

    map.on('move', () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      })
    })

    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/driving'
    })
    console.log('dirs', directions)

    map.on('click', 'points', (e) => {
      // There's a few different ways data is layed out in the json because of differing sources.
      const dataStructureType1 = {
        name: e.features[0].properties.Name
      }
      const dataStructureType2 = {
        name: e.features[0].properties.TOILET_NAME,
        description: e.features[0].properties.DESCRIPTION,
        openTimes: e.features[0].properties.USE_RESTRICTIONS,
      }
      const dataStructureType3 = {
        description: "<strong>Toilets :)</strong> <p>No extra information :(</p>"
      }
      
      const setName = () => {if (dataStructureType1.name != undefined) {
        return dataStructureType1.name
      } else if (dataStructureType2.name != undefined){
        return dataStructureType2.name
      } else {
        return "Toilets :)"
      }}

      const addToWaypointsNoArgs = () => {
        const newArray = [...this.props.currentTrip.inbetweenWaypoints]
        const nameOfToilet = setName()
        newArray.push({
          buildingName: capitalize(nameOfToilet),
          label: "label",
          latitude: coordinates[1],
          longitude: coordinates[0],
          streetName: "street",
        })
        const tripDataWithNewStop = {
          tripName: this.props.currentTrip.tripName,
          startWaypoint: this.props.currentTrip.startWaypoint,
          inbetweenWaypoints: newArray,
          endWaypoint: this.props.currentTrip.endWaypoint,
        }
        this.props.dispatch(addNewTrip(tripDataWithNewStop))
      }

      const coordinates = e.features[0].geometry.coordinates.slice()
      const setToiletDescription = (descOne, descTwo, descThree) => {
        // window.dostuff = this.dostuff
        // ^--- to make a function as global as possible.
        // <button onClick='window.dostuff()'>hi</button>
        // ^--- for below HTML in if statements
        // window.addToWaypoints = this.addToWaypoints(coordinates, descTwo.name)
        // ^--- can't use arguments?
        window.addToWaypoints = addToWaypointsNoArgs // <--- use this one
        // ^--- defined above in current scope (map on click) to keep variables
        // because we can't use arguments (I think).
        if (descOne.name != undefined) {
          return (
            `<strong>${descOne.name}</strong>
            <br>
            <button onClick='window.addToWaypoints()'>Add stop to trip</button>`
            )
        }
        else if (descOne.name == undefined && descTwo.description != "null" && descTwo.description != undefined && descTwo.openTimes != "null" && descTwo.openTimes != undefined) {
          descTwo.name = capitalize(descTwo.name)
          return (
            `<strong>${descTwo.name}</strong>
            <p>${descTwo.description}</p>
            <p>Open: ${descTwo.openTimes}</p>
            <button onClick='window.addToWaypoints()'>Add stop to trip</button>`
          )
        }
        else if (descOne.name == undefined && descTwo.description == "null" || descTwo.openTimes == "null") {
          return (
            `<strong>${capitalize(descTwo.name)}</strong>
            <strong>Toilets</strong>
            <p>No extra information :(</p>
            <button onClick='window.addToWaypoints()'>Add stop to trip</button>`
          )
        }
        else {
          return (
            `${descThree.description}
            <button onClick='window.addToWaypoints()'>Add stop to trip</button>`
          )
        }
      }
      let description = setToiletDescription(dataStructureType1, dataStructureType2, dataStructureType3)

      function capitalize(sentence) {
        let arrayOfStrings = sentence.split(" ")
        if (arrayOfStrings.indexOf("") != -1) { // in case there's only one word (Longburn was being deleted >:c ) .length might've been useful)
          arrayOfStrings.splice(arrayOfStrings.indexOf(""), 1) // in case there's an extra space in a sentance ie "yo  dog."
        }
        let capitalizedArray = arrayOfStrings.map(string => {
          const wordBody = string.substr(1)
          return (string[0].toUpperCase() + wordBody.toLowerCase())
        })
        let capitalizedStr = capitalizedArray.join(' ')
        return (capitalizedStr)
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map)
    })

    directions.onClick = () => {}
    directions.onDragDown = () => {} // Stops user from moving waypoints because they don't set GS currently.
    map.addControl(directions, 'top-left')

    map.on('load', () => {
      directions.setOrigin([
        this.props.currentTrip.START.longitude,
        this.props.currentTrip.START.latitude,
      ])

      this.props.currentTrip.inbetweenWaypoints.map((element, i) => {
        directions.addWaypoint(i + 1, [
          element.longitude,
          element.latitude,
        ])
      })

      directions.setDestination([
        this.props.currentTrip.END.longitude,
        this.props.currentTrip.END.latitude,
      ])


      map.loadImage(
        './images/toilet-icon.png',
        function (error, image) {
          if (error) throw error
          map.addImage('custom-marker', image)
          // Add a GeoJSON source with 2 points
          map.addSource('points', {
            'type': 'geojson',
            'data': bathroomData
          })

          //Add a symbol layer
          map.addLayer({
            'id': 'points',
            'type': 'symbol',
            'source': 'points',
            'layout': {
              'icon-image': 'custom-marker',
              // get the title name from the source's "title" property ---V
              // 'text-field': ['get', 'Name'],
              // 'text-font': [
              //   'Open Sans Semibold',
              //   'Arial Unicode MS Bold'
              // ],
              'text-offset': [0, 1.25],
              'text-anchor': 'top'
            }
          })
        }
      )
    })
  }

  render() {
    return (
      <div>
        <div className='sidebarStyle'>
          <div>Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom: {this.state.zoom}</div>
        </div>
        <div ref={el => this.mapContainer = el} className='mapContainer' />
      </div>
    )
  }
}

const mapStateToProps = ({ currentTrip }) => {
  return {
    currentTrip,
  }
}

export default connect(mapStateToProps)(Mapbox)

