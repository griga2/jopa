import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { log } from 'console';
import { json } from 'stream/consumers';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async AddAlcocode(Body){

    const products : Array<object> = Body["RecordSet"];
    
    console.log(products);
    const head = {headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZTI5YWQ1ZTMtN2E0Ni00Mjg0LWJhYTktNDQxMWZlNGVkNjRlIiwiZW52IjoicHJvZCIsImlhdCI6MTY4NDE1ODA0NSwiZXhwIjoxNjg1OTU4MDQ1LCJzdWIiOiJlMjlhZDVlMy03YTQ2LTQyODQtYmFhOS00NDExZmU0ZWQ2NGUifQ.LPLKcb_mdmL-Mqbvl9PSOUimTzFGeP_JYnNqdzqzhYE'
    }}

    for (const product of products) {

      let data = JSON.stringify({
        query: `query FindProductByArticle($articul : String!, $branch : String!){
        ProductSearch(input:{name:$articul,branch:$branch}){
          products{name,id,articul}
        }
      }`,
        variables: {"articul":product["NAME"]
        ,"branch":"305a5256-8cf8-4581-bd13-d8d570f690ad"}
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.entersight.ru/graphql',
        headers:head.headers,
        data : data
      };

      const ResponseFithId = await axios.request(config);
      // console.log(ResponseFithId.data.data.ProductSearch?.products[0]?.id);
      
      console.log(JSON.stringify(ResponseFithId.data) + '/n'+  product["ACL_CODE"] );
      
      if (ResponseFithId.data.data.ProductSearch?.products?.[0] ) {
        if ( product["ACL_CODE"] != "" ) {

          const masOfCode = product["ACL_CODE"].split(' / ')
          
          for (const code of masOfCode) {
            let DataForAlcode = JSON.stringify({
              query: `mutation CreateProductExternalId($product: ID, $supplier: ID, $external_id: String, $ext_name: String, $ext_quant: Float, $source : String)
            { 
                CreateProductExternalId(  
                  input: {product: $product, supplier: $supplier, external_id: $external_id, ext_quant: $ext_quant, ext_name: $ext_name , source : $source
                  }){
                      id,external_id
                  }
            }`,
              variables: {"source":"egais","external_id":code.replace("/",''),"product":ResponseFithId.data.data.ProductSearch.products[0].id}
            });

            let configForAlcode = {
              method: 'post',
              maxBodyLength: Infinity,
              url: 'https://api.entersight.ru/graphql',
              headers:head.headers,
              data : DataForAlcode
            };

            let responceAboutCreateAlcode = axios.request(configForAlcode)
            console.log((await responceAboutCreateAlcode).data);
          }
        } else {
          console.log("non alco code");
        }
      } else {
        'don foud product'
      }
    }
  }
}


