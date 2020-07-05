import {Response, Request} from 'express';
import knex from "../database/conection";


class PointsController {

    async create(request: Request, response:Response){
        
        const trx = await knex.transaction();

        const {
            name, 
            email, 
            whatsapp, 
            latitude, 
            longitude, 
            city, 
            uf, 
            items
        } = request.body;

        const point = {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            image: request.file.filename
        };
    
        const pointInsertedIds = await trx('points').insert(point);

        const pointId = pointInsertedIds[0];
        
        const pointsItems = items
            .split(',')
            .map((item:string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id: item_id,
                    point_id: pointId
                }
            });
        
        await trx('points_items').insert(pointsItems);
        
        await trx.commit();

        return response.json({
            id: pointId,
            ...point
        });
    }

    async show(request: Request, response: Response){
        
        const {id} = request.params;

        const point = await knex('points').where('id', id).first();

        if(!point){
            return response.status(400).json({message: 'Point not found'});
        }

        const items = await knex('items')
            .select('items.*')
            .join('points_items', 'points_items.item_id', '=', 'items.id')
            .where('points_items.point_id', id);
        
        point.items = items;

        const serializedPoint = {
            ...point,
            image_url: `http://192.168.15.4:3333/uploads/imagepoints/${point.image}`
        }
        
        return response.json(serializedPoint);
    }

    async index(request: Request, response: Response){

        const {city, uf, items: itemsFilter} = request.query;

        const items = String(itemsFilter)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('points_items', 'points_items.point_id', '=', 'points.id')
            .where(function(){
                if (items.length > 0 && items[0] != 0){
                    console.log(items, items.length);
                    this.whereIn('points_items.item_id', items)
                }

                const strCity = String(city).trim().toUpperCase();
                if (strCity != ''){
                    this.whereRaw(`Upper(city)='${strCity}'`);
                }
                
                const strUf = String(uf).trim().toUpperCase();
                if (strUf){
                    this.whereRaw(`Upper(uf)='${strUf}'`);
                }
                console.log(this.toQuery());
            })
            .distinct()
            .select('points.*');
        
        const serializedPoints = points.map(point => ({
            ...point,
            image_url: `http://192.168.15.4:3333/uploads/imagepoints/${point.image}`
        }));
        
        return response.json(serializedPoints);
    }
}

export default PointsController;