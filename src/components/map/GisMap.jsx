import 'ol/ol.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import * as olProj from 'ol/proj';
import * as control from 'ol/control';
import * as coordinate from 'ol/coordinate';
import LayerSwitcher from 'ol-layerswitcher';
import * as layer from 'ol/layer';
import * as source from 'ol/source';
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
const attributes = [
  'school_name',
  'region',
  'province',
  'municipality',
  'division',
  'district',
];
function GisMap() {
  const [map, setMap] = useState();
  const [mapData, setMapData] = useState();
  const [showQuery, setShowQuery] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState();
  const [queryResult, setQueryResult] = useState(null);
  const [center, setCenter] = useState({
    long: 125.568014,
    lat: 8.8904,
    zoom: 10,
  });
  const homeRef = useRef();
  const fullscreenRef = useRef();
  const scaleRef = useRef();
  const zoomInRef = useRef();
  const inputRef = useRef();
  const queryRef = useRef();
  const zoomOutRef = useRef();
  const posRef = useRef();
  const mapElement = useRef();
  const wfsUrl = 'http://localhost:8080/geoserver/ows';
  const handleMapClick = event => {
    const resolution = map.getView().getResolution();
    const projection = map.getView().getProjection();
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
        console.log(data);
      }
    });
  };

  const depedLayer = new layer.Tile({
    title: 'Colored Philippine Layer',
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
  const bingMapsAerial = new layer.Tile({
    title: 'Aerial',
    type: 'base',
    source: new source.BingMaps({
      key: 'AsMcqtm-jc8We9M2m9Dq9K8c62I7jlwqVCQ4Hpv1mpVIk6u8ZhAmHuG6BgPwTEBn',
      imagerySet: 'Aerial',
    }),
  });
  useEffect(() => {
    const nonTile = new layer.Tile({});
    const openStreetMap = new layer.Tile({
      title: 'Open Street Map',
      type: 'base',
      visible: true,
      source: new source.OSM(),
    });

    const baseGroup = new layer.Group({
      title: 'Base Maps',
      fold: true,
      layers: [openStreetMap, nonTile, bingMapsAerial],
    });
    const overlayGroup = new layer.Group({
      title: 'Overlays',
      fold: true,
      layers: [depedLayer],
    });
    const homeControl = new control.Control({
      element: homeRef.current,
    });
    const fullscreenControl = new control.Control({
      element: fullscreenRef.current,
    });
    const zoomInControl = new control.Control({
      element: zoomInRef.current,
    });
    const zoomOutControl = new control.Control({
      element: zoomOutRef.current,
    });
    const queryControl = new control.Control({
      element: queryRef.current,
    });
    const scaleControl = new control.ScaleLine({
      units: 'metric',
      target: scaleRef.current,
    });

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

    //creating a map
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
    initialMap.addControl(fullscreenControl);
    initialMap.addControl(homeControl);
    initialMap.addControl(zoomInControl);
    initialMap.addControl(zoomOutControl);
    initialMap.addControl(queryControl);
    initialMap.addControl(layerSwitcher);
    initialMap.addControl(scaleControl);
    initialMap.addControl(mousePosition);
    initialMap.on('click', handleMapClick);
    if (queryResult !== null) {
      const vectorSource = new VectorSource();
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
    setMap(initialMap);
    return () => {
      initialMap.setTarget(null);
    };
  }, [center, queryResult]);
  function handleHomeButtonClick() {
    alert('Hello');
  }
  function handlefsButtonClick() {
    var mapFull = mapElement.current;
    if (mapFull.requestFullscreen) {
      map.requestFullscreen();
    } else if (mapFull.mozRequestFullScreen) {
      map.mozRequestFullScreen();
    } else if (mapFull.webkitRequestFullscreen) {
      map.webkitRequestFullscreen();
    } else if (mapFull.msRequestFullscreen) {
      map.msRequestFullscreen();
    }
  }
  function handleZoomIn() {
    map.getView().setZoom(map.getView().getZoom() + 1);
  }
  function handleZoomOut() {
    map.getView().setZoom(map.getView().getZoom() - 1);
  }
  function handleFormSubmit(event) {
    event.preventDefault();

    let attribute;
    if (selectedAttribute === 'school_name') {
      attribute = 'school_nam';
    } else if (selectedAttribute === 'municipality') {
      attribute = 'municipali';
    } else {
      attribute = selectedAttribute;
    }
    var operator = 'LIKE'; // The operator, LIKE for pattern matching
    var valueToMatch = inputRef.current.value; // The value you want to match
    var typeName = 'land-cover:deped_postgis'; // The typeName in GeoServer

    var cql_filter = `${attribute} ${operator} '%${valueToMatch}%'`;
    var wfsUrl = 'http://localhost:8080/geoserver/wfs'; // Base URL for the GeoServer WFS service

    var url = `${wfsUrl}?service=WFS&version=1.0.0&request=GetFeature&typeName=${encodeURIComponent(
      typeName
    )}&outputFormat=application/json&CQL_FILTER=${encodeURIComponent(
      cql_filter
    )}`;

    axios
      .get(url)
      .then(res => {
        let data = res.data?.features;
        if (data?.length === 0) {
          return;
        }
        setQueryResult(data);
        setShowQuery(false);
      })
      .catch(err => console.error('Error fetching data', err));
  }
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
