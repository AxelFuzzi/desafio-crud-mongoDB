import { Db } from 'mongodb';
import mongoose from 'mongoose';

//insertar 10 documentos en cada coleccion.
const mensajes = [
  {autor: 'autor1@gmail.com', msg: 'mensaje1'}, 
  {autor: 'autor2@gmail.com', msg: 'mensaje2'}, 
  {autor: 'autor3@gmail.com', msg: 'mensaje3'},
  {autor: 'autor4@gmail.com', msg: 'mensaje4'}, 
  {autor: 'autor5@gmail.com', msg: 'mensaje5'}, 
  {autor: 'autor6@gmail.com', msg: 'mensaje6'},
  {autor: 'autor7@gmail.com', msg: 'mensaje7'}, 
  {autor: 'autor8@gmail.com', msg: 'mensaje8'}, 
  {autor: 'autor9@gmail.com', msg: 'mensaje9'},
  {autor: 'autor10@gmail.com', msg: 'mensaje10'}
]

const productos = [
  {title: 'titulo1', price: 5000, thumbnail:'link1'},
  {title: 'titulo2', price: 500, thumbnail:'link2'},
  {title: 'titulo3', price: 4500, thumbnail:'link3'},
  {title: 'titulo4', price: 1500, thumbnail:'link4'},
  {title: 'titulo5', price: 2400, thumbnail:'link5'},
  {title: 'titulo6', price: 3200, thumbnail:'link6'},
  {title: 'titulo7', price: 3600, thumbnail:'link7'},
  {title: 'titulo8', price: 4200, thumbnail:'link8'},
  {title: 'titulo9', price: 700, thumbnail:'link9'},
  {title: 'titulo10', price: 4900, thumbnail:'link10'}
]

const mensajeSchema = new mongoose.Schema({
  autor: {type: String, required: true},
  msg: {type: String, required: true},
  fyh: {type: String, required: true},
})


const productoSchema = new mongoose.Schema({
  title: {type: String, required: true},
  price: {type: Number, required: true},
  thumbnail : {type: String, required: true},
})


const insertarMsg = mongoose.model('mensajes', mensajeSchema)


const insertarProd = mongoose.model('productos', productoSchema)

await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce', {
  serverSelectionTimeoutMS: 5000,
})
console.log('Base de datos conectada')


const insertMsg = []

const insertProd = []


//COMENTAR ESTOS DOS FOR PARA EVITAR QUE SE CREEN 10 MENSAJES Y 10 PRODUCTOS CADA VEZ QUE SE EJECUTE EL ARCHIVO.
for (const mensaje of mensajes){
  insertMsg.push(insertarMsg.create(mensaje))
}

for (const producto of productos){
  insertProd.push(insertarProd.create(producto))
}


const result = await Promise.allSettled(insertMsg)
const rejected = result.filter(r => r.status == 'rejected')
if (rejected.length > 0){
    console.log('Cantidad de fallos en mensajes: ' + rejected.length)
} else {
    console.log("Todo OK!")
}


const result1 = await Promise.allSettled(insertProd)
const rejected1 = result1.filter(r => r.status == 'rejected')
if (rejected1.length > 0){
    console.log('Cantidad de fallos en productos: ' + rejected.length)
} else {
    console.log("Todo OK!")
}


try {

  //listar los documentos en cada coleccion.
  let mensajes = await insertarMsg.find({}, {__v: 0})
    mensajes.forEach(mensaje => {
        console.log(JSON.stringify(mensaje),'fyh:',new Date(mensaje._id.getTimestamp()).toLocaleString()
        )
    })
    
  let productos = await insertarProd.find({}, {__v: 0})
    productos.forEach(producto => {
      console.log(JSON.stringify(producto),'fyh',new Date(producto._id.getTimestamp()).toLocaleString()
      )
  })  
  //------------------------------------------------------------------
  //listar la cantidad de documentos almacenados en las colecciones.
  //------------------------------------------------------------------
  let mensajesCant = await insertarMsg.estimatedDocumentCount({})
    console.log(mensajesCant);


  let productosCant = await insertarProd.estimatedDocumentCount({})
    console.log(productosCant);

  //---------------------------------------------------------------------
  //agregar un producto mas a la coleccion de productos
  //---------------------------------------------------------------------
  let agregarProd = await insertarProd.insertMany({title: 'titulo100000', price: 1800, thumbnail:'link1000000'}, {__v: 0});
    console.log(agregarProd);

  //---------------------------------------------------------------------
  //realizar una consulta por tipo de nombre especifico
  //---------------------------------------------------------------------
  const productoEspecifico = await insertarProd.find( {title:'titulo100000'}, {_id: 0, __v: 0})
    console.log(productoEspecifico);
    
  //-----------------------------------------------------------------------
  //listar los productos con precio menor a 1000.
  //-----------------------------------------------------------------------
  let prodMenorMil = await insertarProd.find({price: {$lt: 1000}})
    console.log(prodMenorMil);

  //-------------------------------------------------------------------------
  //listar los productos con precio entre 1000 a 3000 pesos.
  //-------------------------------------------------------------------------
  let prodMilTresmill = await insertarProd.find({ $and: [ {price: {$gte: 1000}}, {price: {$lte: 3000}} ]})
    console.log(prodMilTresmill);

  //--------------------------------------------------------------------------
  //listar los productos con precio mayor a 3000 pesos.
  //--------------------------------------------------------------------------
  let prodMayorTresmil = await insertarProd.find({price: {$gt: 3000}})
    console.log(prodMayorTresmil);

  //--------------------------------------------------------------------------
  //realizar una consulta que traiga solo el nombre del tercer producto mas barato.
  //---------------------------------------------------------------------------------
  let tercerMasBarato = await insertarProd.find({}, { title: 1, _id: 0 }).skip(2).limit(1).sort({price: 1})
    console.log(tercerMasBarato);


  //---------------------------------------------------------------------------------
  //Hacer una actualización sobre todos los productos, agregando el campo stock a todos ellos con un valor de 100.
  //---------------------------------------------------------------------------------
  /*let stock100 = await insertarProd.updateMany({}, {$set: {stock: 100}})
    console.log(stock100);*/
  
  //usar en mongosh el siguiente comando.
  /*db.productos.updateMany({"price":{$gte: 0}}, {$set: {"stock": 100}}, {upsert: true}); */
  

  //----------------------------------------------------------------------------------
  //cambiar el stock a cero de los productos con precios mayores a 4000.
  //----------------------------------------------------------------------------------
  /*let stockCero = await insertarProd.updateMany({price:{$gt: 4000}}, {$set: {stock: 0}})
    console.log(stockCero);*/
  
  //usar en mongosh el siguiente comando.
  /*db.productos.updateMany({"price":{$gt: 4000}}, {$set: {"stock": 0}});*/


  //---------------------------------------------------------------------------------
  //borrar los productos con precio menor a 1000.
  //---------------------------------------------------------------------------------
  let menor1000 = await insertarProd.deleteMany({price: {$lt: 1000}})
    console.log(menor1000);


  //------------------------------------------------------------------------------------
  //Crear un usuario 'pepe' clave: 'asd456' que sólo pueda leer la base de datos ecommerce. Verificar que pepe no pueda cambiar la información.
  //----------------------------------------------------------------------------------
  /*const crearPepe = await createUser({user: pepe, pwd: asd456, roles: [{ role: read, db: ecommerce }]})
  console.log(crearPepe);*/

  //usar en mongosh el siguiente comando:
  /*db.createUser({user: "pepe",pwd: "asd456",roles: [{ role: "read", db: "ecommerce" }]});*/

  //usar en mongosh el siguiente comando(comprobar que solo es usuario read)
  /*db.productos.insertOne({title: 'titulo99999', price: 1800, thumbnail:'link99999'}); */
  
  //dara un error y no dejara agregar el producto.

} catch (error) {
  console.log(error)
} finally{
  await mongoose.disconnect()
}