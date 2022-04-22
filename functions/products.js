// import {
//   HandlerEvent,
//   HandlerContext,
//   HandlerResponse,
// } from '@netlify/functions';
// @ts-ignore
// import Airtable from 'airtable-node';
// import dotnev from 'dotenv';
// dotnev.config();
const Airtable = require('airtable-node');
require('dotenv').config();

// interface Product {
//   id: number;
//   fields: {
//     name: string,
//     description: string,
//     image: [{ url: string }],
//     price: number,
//   };
// }

const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_APP_BASE)
  .table('products');

// interface CustomHandlerEven
// extends HandlerEvent {
//   queryStringParameters: { id: string };
// }

exports.handler = async (event, context, cb) => {
  const { id } = event.queryStringParameters;
  if (id) {
    try {
      const product = await airtable.retrieve(id);
      if (product.error) {
        return {
          headers: { 'Access-Control-Allow-Origin': '*' },
          statusCode: 404,
          body: `No product with id: ${id}`,
        };
      }
      return {
        headers: { 'Access-Control-Allow-Origin': '*' },
        statusCode: 200,
        body: JSON.stringify(product),
      };
    } catch (error) {
      console.error(error);
      return {
        headers: { 'Access-Control-Allow-Origin': '*' },
        statusCode: 500,
        body: 'Server Error',
      };
    }
  }

  try {
    const { records } = await airtable.list();
    const products = records.map((product) => {
      const { id } = product;
      const { name, image, price } = product.fields;
      const url = image[0].url;
      return { id, name, url, price };
    });
    return {
      headers: { 'Access-Control-Allow-Origin': '*' },
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (error) {
    console.error(error);
    return {
      headers: { 'Access-Control-Allow-Origin': '*' },
      statusCode: 500,
      body: 'Server Error',
    };
  }
};

// module.exports = handler;
// export { handler };
