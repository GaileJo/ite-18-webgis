import 'ol/ol.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';
//react hooks
import { useEffect, useRef, useState } from 'react';
//the class needed to create a map
import Map from 'ol/Map';
import View from 'ol/View';
import * as olProj from 'ol/proj';
import * as control from 'ol/control';
import * as coordinate from 'ol/coordinate';
import LayerSwitcher from 'ol-layerswitcher';
import * as layer from 'ol/layer';
import * as source from 'ol/source';
//axios is a package in order for us to give ability to fetched data from external resources. Returns json data by default
import axios from 'axios';
import Home from '../../../public/pictures/controls/home.svg?react';
import ZoomIn from '../../../public/pictures/controls/zoom-in.svg?react';
import Expand from '../../../public/pictures/controls/expand.svg?react';
import Zoomout from '../../../public/pictures/controls/zoom-out.svg?react';
import Query from '../../../public/pictures/controls/database-zap.svg?react';
import Modal from './Modal';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import VectorLayer from 'ol/layer/Vector';
import AttributeTable from './AttributeTable';
//static data for attributes of the shapefile
const attributes = [
  'school_name',
  'region',
  'province',
  'municipality',
  'division',
  'district',
];
//the GisMap component which is the component responsible for rendering the map
function GisMap() {
  //the map instance will be assigned into this state on which this component will rerender everytime this state changes
  const [map, setMap] = useState();
  //state for map data
  const [mapData, setMapData] = useState();
  //state for flag if to show the query modal or not. Initially set to false
  const [showQuery, setShowQuery] = useState(false);
  //stores the selected attribute
  const [selectedAttribute, setSelectedAttribute] = useState();
  //the result from the query will be stored here which will be an object
  const [queryResult, setQueryResult] = useState(null);
  //center for the view of the map will be dynamic thats why stored in state. Initially the center will be at Butuan City with zoom of 10
  const [center, setCenter] = useState({
    long: 125.568014,
    lat: 8.8904,
    zoom: 10,
  });
  //the refs for the control html elements to be rendered within the map viewport
  const homeRef = useRef();
  const fullscreenRef = useRef();
  const scaleRef = useRef();
  const zoomInRef = useRef();
  const inputRef = useRef();
  const queryRef = useRef();
  const zoomOutRef = useRef();
  const posRef = useRef();
  const mapElement = useRef();
  //static url for wfs
  // const wfsUrl = 'http://localhost:8080/geoserver/ows';
  //the function that will handle everytime our map gets clicked
  const handleMapClick = event => {
    const resolution = map.getView().getResolution();
    const projection = map.getView().getProjection();
    //created url that will be used for fetching data in geoserver
    const url = depedLayer
      .getSource()
      .getFeatureInfoUrl(event.coordinate, resolution, projection, {
        INFO_FORMAT: 'application/json',
        propertyName:
          'school_nam,region,province,municipali,division,enrollment,district',
      });
    axios.get(url).then(response => {
      if (response.data.features.length) {
        const data = response.data.features[0];
        setMapData({
          ...mapData,
          schoolName: data.properties.school_nam,
          region: data.properties.region,
          province: data.properties.province,
          municipali: data.properties.municipali,
          division: data.properties.division,
          enrollment: data.properties.enrollment,
          district: data.properties.district,
        });
      }
    });
  };
  map?.on('click', handleMapClick);
  //the depedLayer tile layer
  const depedLayer = new layer.Tile({
    title: 'Deped Philippine Layer',
    source: new source.TileWMS({
      url: 'http://localhost:8080/geoserver/land-cover/wms',
      params: {
        LAYERS: 'land-cover:deped_postgis',
        TILED: true,
      },
      serverType: 'geoserver',
      visible: true,
    }),
  });
  //the bings Maps layer
  const bingMapsAerial = new layer.Tile({
    title: 'Aerial',
    type: 'base',
    source: new source.BingMaps({
      key: 'AsMcqtm-jc8We9M2m9Dq9K8c62I7jlwqVCQ4Hpv1mpVIk6u8ZhAmHuG6BgPwTEBn',
      imagerySet: 'Aerial',
    }),
  });
  //the map instance is instantiated within the useEffect in order for the map to be rendered once the DOM element is rendered into the browser or painted into the browser
  useEffect(() => {
    //non tile layer
    const nonTile = new layer.Tile({});
    //OSM layer
    const openStreetMap = new layer.Tile({
      title: 'Open Street Map',
      type: 'base',
      visible: true,
      source: new source.OSM(),
    });
    //a group object which groups the openStreetMap, nonTile, bings Tile
    const baseGroup = new layer.Group({
      title: 'Base Maps',
      fold: true,
      layers: [openStreetMap, nonTile, bingMapsAerial],
    });
    //this group has the Deped Layer
    const overlayGroup = new layer.Group({
      title: 'Overlays',
      fold: true,
      layers: [depedLayer],
    });
    // the Control object that has the reference for the element to be rendered in the browser
    const homeControl = new control.Control({
      element: homeRef.current,
    });
    //the fullscreen control object
    const fullscreenControl = new control.Control({
      element: fullscreenRef.current,
    });
    //the zoomIn control object
    const zoomInControl = new control.Control({
      element: zoomInRef.current,
    });
    //the zoom out control object
    const zoomOutControl = new control.Control({
      element: zoomOutRef.current,
    });
    //the query control object
    const queryControl = new control.Control({
      element: queryRef.current,
    });
    //the scale control object
    const scaleControl = new control.ScaleLine({
      units: 'metric',
      target: scaleRef.current,
    });
    //the layer switcher definition for switching layers
    var layerSwitcher = new LayerSwitcher({
      activationMode: 'click',
      startActive: false,
      groupSelectStyle: 'children',
    });

    var mousePosition = new control.MousePosition({
      className: 'mousePosition',
      projection: 'EPSG:4326',
      coordinateFormat: coordinate.createStringXY(4),
      target: posRef.current,
    });

    //creates a map instance and passes the parameters needed for instantiating the map
    const initialMap = new Map({
      target: mapElement.current,
      layers: [baseGroup, overlayGroup],
      view: new View({
        projection: 'EPSG:3857',
        center: olProj.fromLonLat([center.long, center.lat]),
        zoom: center.zoom,
      }),
      controls: [],
    });
    //add the control objects that we have defined above
    initialMap.addControl(fullscreenControl);
    initialMap.addControl(homeControl);
    initialMap.addControl(zoomInControl);
    initialMap.addControl(zoomOutControl);
    initialMap.addControl(queryControl);
    initialMap.addControl(layerSwitcher);
    initialMap.addControl(scaleControl);
    initialMap.addControl(mousePosition);
    //references when clicking the map to the handleMapClick. So basically this handleMapclick will define the logic once the map is clicked as defined above

    //this will dynamically put markers to the map or put the pin once the we have acquired data from our query
    //if we have already a result for the query then we instantiate a vector souce object and foreach result we have obtained, we will make a marker oject to each result and then append it to our vector source
    //also we have added a customized svg file
    if (queryResult !== null) {
      const vectorSource = new VectorSource();
      //looped the returned array of long and lat and foreach of them we create a marker base on those long and lats
      queryResult.forEach(coord => {
        const marker = new Feature({
          geometry: new Point(
            olProj.fromLonLat([
              coord.properties.longitude,
              coord.properties.latitude,
            ])
          ),
        });
        marker.setStyle(
          new Style({
            image: new Icon({
              src: 'pictures/controls/pin.svg',
              scale: 1,
            }),
          })
        );
        vectorSource.addFeature(marker);
      });
      const vectorLayer = new VectorLayer({ source: vectorSource });
      initialMap.addLayer(vectorLayer);
    }
    //as stated on the top part of this code, we will store the map instance into a state in order for our map to be updated when changes happens on this code base
    //the component or generally our view will rerender everytime the map instance changes resulting to a updated data or view all the time
    setMap(initialMap);
    //the useEffect  Hook of react will return a clean up function if ever there is an error then we can safely disconnect the reference to the map.
    //without the cleanUp function, when this component has error rendering, then it will hold a map reference which is not desired if there is an error
    return () => {
      initialMap.setTarget(null);
    };
  }, [center, queryResult]);
  //whenever our center state and whenever we have new result for our query, then we will rerender our component our view in order to provide an updated data
  //for the home control this is the function that will handle the logic
  function handleHomeButtonClick() {
    alert('Hello');
  }
  //for the fullscreen control, this function will handle the logic
  function handlefsButtonClick() {
    var mapFull = mapElement.current;
    if (mapFull.requestFullscreen) {
      mapFull.requestFullscreen();
    } else if (mapFull.mozRequestFullScreen) {
      map.mozRequestFullScreen();
    } else if (mapFull.webkitRequestFullscreen) {
      map.webkitRequestFullscreen();
    } else if (mapFull.msRequestFullscreen) {
      map.msRequestFullscreen();
    }
  }
  //for the zoom in logic, basically just zooms our map instance views by one on each click to the button
  function handleZoomIn() {
    map.getView().setZoom(map.getView().getZoom() + 1);
  }
  //for the zoom out logic, basically just zooms out our map instance views by one on each click to the button

  function handleZoomOut() {
    map.getView().setZoom(map.getView().getZoom() - 1);
  }
  //this function will handle the logic for the query button
  function handleFormSubmit(event) {
    event.preventDefault();
    //just checks if the attribute selected is school name then transform it to school_nam since in our shapefile data we have school_nam attribute instead of school_name
    //same case for municipality
    let attribute;
    if (selectedAttribute === 'school_name') {
      attribute = 'school_nam';
    } else if (selectedAttribute === 'municipality') {
      attribute = 'municipali';
    } else {
      attribute = selectedAttribute;
    }
    //our operator will be a LIKE operator
    var operator = 'LIKE';
    var valueToMatch = inputRef.current.value; // The value from our input field
    var typeName = 'land-cover:deped_postgis'; // our layer in geoserver
    //the filter definition
    var cql_filter = `${attribute} ${operator} '%${valueToMatch}%'`;
    //constructs the url that will be used to fetch data to
    var wfsUrl = 'http://localhost:8080/geoserver/wfs'; // Base URL for the GeoServer WFS service
    //constructs the url that will be used to fetch data to
    var url = `${wfsUrl}?service=WFS&version=1.0.0&request=GetFeature&typeName=${encodeURIComponent(
      typeName
    )}&outputFormat=application/json&CQL_FILTER=${encodeURIComponent(
      cql_filter
    )}`;
    //fetches data using axios library from external resource service or the wfs
    axios
      .get(url)
      .then(res => {
        //when the promise returns a result a callback function will be triggered resulting to set the acquired data to the state we have defined above like the result data from the query
        let data = res.data?.features;
        //if we have no data fetched then simply just return
        if (data?.length === 0) {
          setShowQuery(false);
          return;
        }
        setQueryResult(data);
        //closes the modal
        setShowQuery(false);
      })
      .catch(err => console.error('Error fetching data', err));
  }
  //the jsx that will be returned or will be rendered. The map element is also defined here
  return (
    <div className='h-screen flex'>
      <div className='pl-[3rem] pt-[3rem] w-3/4 space-y-4'>
        <div className='flex justify-between pr-[1rem]'>
          <div>
            <h1 className='text-white font-bold text-2xl'>
              WEBGIS SCHOOL FINDER
            </h1>
          </div>
          <div className='flex space-x-4'>
            <h1 className='text-white font-bold text-xl'>Legend</h1>
            <h1 className='text-white font-bold text-xl'>Legend</h1>
          </div>
        </div>
        <div className='h-[90%] w-full'>
          <div
            id='map'
            ref={mapElement}
            className='w-full h-full overflow-hidden relative'
          ></div>
          <h1 ref={posRef}></h1>
        </div>

        <div className=' flex flex-col space-y-2 py-3 '>
          <div
            className='absolute left-[1rem] bg-[#D9D9D9] max-w-[40px] top-4 flex items-center justify-center'
            ref={homeRef}
          >
            <button className=' mb-auto top' onClick={handleHomeButtonClick}>
              <Home className='w-[40px] h-[40px]' />
            </button>
          </div>
          <div
            className=' absolute mb-auto top-4 left-[4rem] max-w-[40px] bg-[#D9D9D9] flex items-center justify-center'
            ref={fullscreenRef}
          >
            <button
              className='bg-button-bg text-black font-bold items-center  rounded-[2px] border-none hover:bg-button-hover  flex justify-center'
              onClick={handlefsButtonClick}
            >
              <Expand className='w-[40px] h-[40px]' />
            </button>
          </div>
          <div
            className='absolute mb-auto  bg-[#D9D9D9] max-w-[40px] left-[7rem] top-4 flex items-center justify-center '
            ref={zoomInRef}
          >
            <button onClick={handleZoomIn}>
              <ZoomIn className='w-[40px] h-[40px]' />
            </button>
          </div>
          <div
            className='absolute mb-auto  bg-[#D9D9D9] max-w-[40px] left-[10rem] top-4 flex items-center justify-center '
            ref={zoomOutRef}
          >
            <button onClick={handleZoomOut}>
              <Zoomout className='w-[40px] h-[40px]' />
            </button>
          </div>
          <div
            className='absolute mb-auto  bg-[#D9D9D9] max-w-[40px] left-[13rem] top-4 flex items-center justify-center '
            ref={queryRef}
          >
            <button
              onClick={() => {
                setShowQuery(true);
              }}
            >
              <Query className='w-[40px] h-[40px]' />
            </button>
          </div>
          <Modal isOpen={showQuery} setShowQuery={setShowQuery}>
            <div className='mb-4'>
              <form onSubmit={handleFormSubmit}>
                <label
                  className='block text-gray-700 text-sm font-bold mb-2'
                  htmlFor='region'
                >
                  Select Attribute
                </label>
                <select
                  className='shadow border rounded w-full py-2 px-3 text-gray-700'
                  onChange={event => setSelectedAttribute(event.target.value)}
                  value={selectedAttribute}
                >
                  {attributes.map((attribute, index) => {
                    return (
                      <option key={index} value={attribute}>
                        {attribute}
                      </option>
                    );
                  })}
                </select>
                <label
                  className='block text-gray-700 text-sm font-bold mb-2'
                  htmlFor='region'
                >
                  Input Value
                </label>
                <input
                  ref={inputRef}
                  type='text'
                  className='p-2 w-full rounded-md border-black border-2'
                />

                <div className='flex justify-end pt-2'>
                  <button
                    className='modal-close px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400'
                    type='submit'
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
            {/* Repeat for other form fields */}
          </Modal>
        </div>
      </div>
      <div className='flex-1 pt-[3rem] px-[2rem] space-y-6'>
        <div className='mx-auto max-w-1/2 p-4 bg-gray-400 rounded-md'>
          <h1 className='text-xl font-bold text-black'>Instructions:</h1>
          <p className='text-left'>
            Click the view finder icon to search for a specific school. All
            school details will be presented in the table below
          </p>
        </div>
        {mapData ? <AttributeTable mapData={mapData} /> : null}
      </div>
    </div>
  );
}

export default GisMap;
