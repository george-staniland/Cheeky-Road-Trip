# Cheeky Roadtrip :red_car:
### Created in a team of four over six days at Wellington based [Dev Academy](https://devacademy.co.nz/)
#### Team: [Derek](https://github.com/derekbutlr), [Ben](https://github.com/ben-irvine), [Richard](https://github.com/richard-eman)
#### Tech-Stack: Node.js, React, Redux, Mapbox, Express, PositionStack API
#### Preview
<img src="readme-images/prev-1.png" width="500">
<img src="readme-images/prev-2.png" width="500">
<img src="readme-images/prev-3.png" width="500">

#### Application hosted here
*- apologies for the slow load speed, developement verison hosted on the free Heroku platform*


https://cheeky-roadtrip.herokuapp.com/

<br />
<br />
<br />
<br />

# Working Proccess below :wrench: :computer:

#### Setup

Run the following commands in your terminal:

```sh
npm install
cp .env.example .env
```
Input API keys into .env

To run in development: (make sure you have a .env file)
```sh
npm run dev
```

To run in production:
```sh
npm start
```

## User Stories
### MVP
* ~~I want to be able to establish my road trip with a title, and start/end waypoints~~
* ~~I want to see a map that shows me the route between my waypoints~~
* I want to see all the public bathrooms near my route*
* ~~I want to see direction instructions~~

### Stretch
* I want to log in
* I want to be able to leave ratings of bathrooms and see the average rating*
* ~~I want to be able to see other neat stops besides public bathrooms (e.g. swimming spots, cafe's) ~~
* ~~I want to be able to select these stops on the map to add them as waypoints~~
* I want to be able to save my road trip as a img or text file to refer to later*

## Wireframes

##### Homepage

<img src="readme-images/update-landing-page.jpg" width="500">


##### Dashboard

<img src="readme-images/update-dashboard.jpg" width="500">

## New Tech

* Leaflet and React-Leaflet
Node modules used to set up the map interface and the markers using react components. (no longer being used)

* Leaflet Routing Machine
Creates the route between our established waypoints. (no longer being used)

* Mapbox.gl
Swapped from leaflet to mapbox due to issues we were having with leaflet's routing machine

* Position Stack API
Used to convert street addresses into GPS coordinates for our user start/end point input.


## Views
| name | purpose |
| --- | --- |
| Homepage | Establish details of trip |
| Dashboard | Shows the map, route, directions and relevant stops |


## Reducers

  | name | purpose |
  | --- | --- |
  | auth | Store information regarding user logins, auth status and auth errors |
  | currentTrip | Store info about the users current road trip (waypoints, trip name) |
  | waypointConfirmation | Used to gather searched addresses from position stack API |
  
## Actions


  | type | data | purpose |
  | --- | --- | --- |
  | ADD_INSTRUCTIONS | array of strings | For saving the directions of the trip from directions API call |
  | CONFIRM_ADDRESS | object and string | Saves a selected waypoint in the correct category (START, MID or END) |
  | ADD_TRIP_NAME | string | Saves the name of the trip |
  | ERASE_TRIP | none | Resets currentTrip state back to empty default |
  | --- | --- | --- |
  | SEARCH_ADDRESS | array of objects | stores the returned waypoint data of the position stack API so the user can confirm |

