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
function GisMap() {
  const [map, setMap] = useState();
  const [mapData, setMapData] = useState();
  const [openModal, setOpenModal] = useState(false);
  //default is butuan city's long and lat
  const [center, setCenter] = useState({
    long: 125.568014,
    lat: 8.8904,
    zoom: 10,
  });
  const homeRef = useRef();
  const scaleRef = useRef();
  const homeButtonRef = useRef();
  const fsRef = useRef();
  const mapRef = useRef();
  const mapElement = useRef();
  mapRef.current = map;
  const school = 'Ampayon CES';
  const region = 'CARAGA';
  const wfsUrl = 'http://localhost:8080/geoserver/ows';
  const wfsParameters = {
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typeName: 'land-cover:deped_postgis',
    outputFormat: 'application/json',
    cql_filter: `school_nam='${school}' AND region='${region}'`,
  };
  const handleMapClick = event => {
    const map = mapRef.current;
    const resolution = map.getView().getResolution();
    const projection = map.getView().getProjection();
    const url = coloredLayer
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
        setOpenModal(true);
      }
    });
    //transfer this logic to a on submit form
    const wfsRequestUrl = `${wfsUrl}?${new URLSearchParams(
      wfsParameters
    ).toString()}`;
    axios.get(wfsRequestUrl).then(res => console.log(res));
  };

  const coloredLayer = new layer.Tile({
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
      layers: [coloredLayer],
    });
    const homeControl = new control.Control({
      element: homeButtonRef.current,
      target: homeRef.current,
    });
    const fsControl = new control.FullScreen({
      // element: fsButtonRef.current,
      target: 'fullscreen',
    });
    console.log(scaleRef.current);
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
      coordinateFormat: function (coord) {
        return coordinate.format(coord, '{y}{x}', 6);
      },
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
    initialMap.addControl(homeControl);
    initialMap.addControl(fsControl);
    initialMap.addControl(mousePosition);
    initialMap.addControl(layerSwitcher);
    initialMap.addControl(scaleControl);

    initialMap.on('click', handleMapClick);
    setMap(initialMap);
    return () => {
      initialMap.setTarget(null);
    };
  }, [homeRef.current, center]);
  function handleHomeButtonClick() {
    alert('Hello');
  }
  function handlefsButtonClick() {
    var map = mapElement.current;
    // console.log(map);
    if (map.requestFullscreen) {
      map.requestFullscreen();
    } else if (map.mozRequestFullScreen) {
      map.mozRequestFullScreen();
    } else if (map.webkitRequestFullscreen) {
      map.webkitRequestFullscreen();
    } else if (map.msRequestFullscreen) {
      map.msRequestFullscreen();
    }
  }
  return (
    <div className='h-screen flex'>
      <div className='pl-[3rem] pt-[3rem] flex-1 space-y-4'>
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
        {/* <h1 className='scale-line' ref={scaleRef}></h1> */}
        <div className='h-[80%] w-full'>
          <div
            id='map'
            ref={mapElement}
            className='w-full h-full overflow-hidden'
          ></div>
        </div>

        <div className=' flex flex-col space-y-2 py-3 '>
          <div className='relative ml-[10px]' ref={homeRef}>
            <button
              className='bg-button-bg text-black font-bold items-center h-[30px] w-[30px] rounded-[2px] border-none hover:bg-button-hover z-50 flex justify-center'
              onClick={handleHomeButtonClick}
              ref={homeButtonRef}
            >
              <img
                src='/pictures/controls/home.png'
                className='w-[20px] h-[20px] brightness-0 align-middle'
              />
            </button>
          </div>
          <div className=' relative mb-auto ml-[10px] '>
            <button
              className='bg-button-bg text-black font-bold items-center h-[30px] w-[30px] rounded-[2px] border-none hover:bg-button-hover z-50 flex justify-center'
              onClick={handlefsButtonClick}
              ref={fsRef}
            >
              <img
                src='/pictures/controls/fullscreen.png'
                className='w-[20px] h-[20px] brightness-0 align-middle'
              />
            </button>
          </div>
        </div>
      </div>
      <div className='flex-1'> test</div>
      {/* <Modal
        isOpen={openModal}
        closeModal={() => {
          setOpenModal(false);
        }}
      >
        <p className='text-xl mb-2 font-bold'>
          School Name: {mapData?.schoolName ?? null}
        </p>
        <p className='mb-2 font-bold'>District : {mapData?.district ?? null}</p>
        <p className='font-bold'>Division : {mapData?.division ?? null}</p>
        <p className='font-bold'>
          Municipality : {mapData?.municipali ?? null}
        </p>
        <p className='font-bold'>Region : {mapData?.region ?? null}</p>
        <button
          className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700'
          onClick={() => setOpenModal(false)}
        >
          Close Modal
        </button>
      </Modal> */}
    </div>
  );
}

export default GisMap;
