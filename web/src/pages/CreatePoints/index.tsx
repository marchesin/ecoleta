import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';
import axios from 'axios';

import Dropzone from '../../components/Dropzone';
import './CreatePoint.css'
import logo from '../../assets/logo.svg';

interface Item{
  id: number;
  title: string;
  image: string;
  image_url: string;
}

interface IbgeRegion{
  id:number;
  nome: string;
  sigla: string;
}

interface IbgeUf{
  id: number;
  nome:string;
  regiao?:IbgeRegion;
  sigla:string;
}

interface IbgeCities{
  id: number;
  nome:string;
}

const CreatePoint = () => {

  const [ items, setItems ]                     = useState<Item[]>([]);
  const [ ufs, setUfs ]                         = useState<IbgeUf[]>([]);
  const [ cities, setCities ]                   = useState<IbgeCities[]>([]);
  const [ initialPosition, setInitialPosition ] = useState<[number, number]>([0,0]);
  const [ selectedUf, setSelectedUf]            = useState('0');
  const [ selectedCity, setSelectedCity]        = useState('0');
  const [ formData, setFormData ]               = useState({
    name: '',
    email: '',
    whatsapp: '',
  });  
  const [ latitude, setLatitude]                = useState(0);
  const [ longitude, setLongitude]              = useState(0);
  const [ selectedItems, setSelectedItems ]     = useState<number[]>([]);
  const [ selectedFile, setSelectedFile ]       = useState<File>();

  const history = useHistory();

  //PEGA OS ITEM DE RESIDUOS
  useEffect(()=>{
    api.get('items').then(response => {
      setItems(response.data);
    });
  }, []);

  // PEGA AS UNIDADES FEDERATIVAS (UF)
  useEffect(()=>{
    axios
      .get<IbgeUf[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(response => {
        setUfs(response.data);
      }
    );
  },[]);
  
  // PEGA O MUNICIPIOS COM BASE NO ID DA UNIDADE FEDERATIVA
  useEffect(()=>{
    axios
      .get<IbgeCities[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        setCities(response.data);
      }
    );
  },[selectedUf]);

  // PEGAR NOSSA GEOLOCALIZAÇÃO
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(position => {
      //const { latitude, longitude } = position.coords;
      //setInitialPosition([latitude, longitude]);
      setInitialPosition([-8.007978, -34.889321]);
      setLatitude(-8.007978);
      setLongitude(-34.889321);
    })
  },[]);

  function handleSeletUf(event: ChangeEvent<HTMLSelectElement>){
    setSelectedUf(event.target.value);
  }

  function handleSeletCity(event: ChangeEvent<HTMLSelectElement>){
    setSelectedCity(event.target.value);
  }

  function handleMapClick(event: LeafletMouseEvent){
    const { lat, lng } = event.latlng;
    setLatitude(lat);
    setLongitude(lng);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>){
    const { name, value } = event.target;
    setFormData({...formData, [name]: value});
  }

  function handleSelectedItem(id: number){

    const alreadySeleted = selectedItems.findIndex(item => item === id);
    if (alreadySeleted >= 0){
      const filteredItems = selectedItems.filter(item => item !== id);
      setSelectedItems(filteredItems);
    }else{
      setSelectedItems([...selectedItems, id]);
    }

  }

  async function handleSubmit(event: FormEvent){
    event.preventDefault();
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('whatsapp', formData.whatsapp);
    data.append('email', formData.email);
    data.append('latitude', String(latitude)); 
    data.append('longitude', String(longitude));
    data.append('city', selectedCity);
    data.append('uf', selectedUf);
    data.append('items', selectedItems.join(','));
    if (selectedFile)  data.append('image', selectedFile);

    console.log(data);
    await api.post('/points', data);

    alert('Ponto de coleta criado.')

    history.push('/');
    
  }

  return(
    <>
      <div id="page-create-point">
        <header>
            <img src={logo} alt="Ecoleta"/>
            <Link to="/"><FiArrowLeft />Voltar para Home</Link>
        </header>

        <form onSubmit={handleSubmit}>
          <h1>Cadastro do <br />ponto de coleta</h1>

          <Dropzone onFileUploaded={setSelectedFile} ></Dropzone>

          <fieldset>
            <legend><h2>Dados</h2></legend>

            <div className="field">
              <label htmlFor="name">Nome da entidade</label>
              <input 
                type="text"
                name="name"
                id="name"
                onChange={handleInputChange}
              />
            </div>

            <div className="field-group">

              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input 
                  type="text"
                  name="email"
                  id="email"
                  onChange={handleInputChange}
                />
              </div>

              <div className="field">
                <label htmlFor="whatsapp">Whatsapp</label>
                <input 
                  type="text"
                  name="whatsapp"
                  id="whatsapp"
                  onChange={handleInputChange}
                />
              </div>

            </div>

          </fieldset>

          <fieldset>
            <legend>
              <h2>Endereços</h2>
              <span>Selecione o endereço no mapa</span>
            </legend>

            <Map center={initialPosition} zoom={17} onClick={handleMapClick}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={[latitude,longitude]} />
            </Map>

            <div className="fild-group">

              <div className="field">
                <label htmlFor="uf">Estado(UF)</label>
                <select name="uf" id="uf" value={selectedUf} onChange={handleSeletUf}>
                  <option value="0" >Selecione um Estado</option>
                  {
                    ufs?.map(uf => {
                      return(
                        <option key={uf.id} value={uf.sigla}>{uf.nome}({uf.sigla})</option>
                      );
                    })
                  }
                </select>
              </div>

              <div className="field">
                <label htmlFor="city">Cidade</label>
                <select name="city" id="city" value={selectedCity} onChange={handleSeletCity}>
                  <option value="0">Selecione uma cidade</option>
                  {
                    cities?.map(city => {
                      return(
                        <option key={city.id} value={city.nome}>{city.nome}</option>
                      );
                    })
                  }
                </select>
              </div>

            </div>

          </fieldset>

          <fieldset>
            <legend>
              <h2>Itens de coleta</h2>
              <span>Selecione um ou mais ítens abaixo</span>
            </legend>

            <ul className="items-grid">
              {
                items.map(item => {
                  return(
                    <li 
                      key={item.id} 
                      onClick={() => handleSelectedItem(item.id)}
                      className={selectedItems.includes(item.id) ? 'selected': ''}
                    >
                      <img src={item.image_url} alt={item.title}/>
                      <span>{item.title}</span>
                    </li>
                  );
                })
              }
            </ul>

          </fieldset>

          <button type="submit">Cadastrar ponto de coleta</button>
        </form>
      </div>
    </>
  );
}

export default CreatePoint;