import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { log } from 'console';
import { json } from 'stream/consumers';


export class CreateProductDto {
  ARTICUL: string; // code 1
  MARKING_TYPE: number; // code 2
  NAME: string; // code 3
  NAME_PROVIDER: string;
  INN_PROVIDER: string;
  NAME_MESURIMENT: string; // code 4
  BARCODE: string; // code 5
  QUANTITY: string; // code 6
  NETTO: number; // code 7
  CLASSIF: string;  // code 8
  PRICE_ROZ: number; // code 9
  PRICE_SEB: number; // code 10
  ALC_CODE: string; // code 11
  MERC_CODE: string; // code 12
  CL_ARTICULE: string; // code 13
  CL_NAME: string; // code 14
  NDS: number; // code 15
  SRC_GOND: string; // code 16
  SCALE_CODE: string; // code 17
  SCALE_MASSAGE: string; // code 18
}


@Injectable()
export
 class AppService {
  async AddCont(Body: any) {
      const contrs: Array<CreateProductDto> = Body.RecordSet;
      // console.log(Body)
      const head = {headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiM2NhNzYwODktNDQyNy00NjQwLWJhNzEtOGE1YWNhMGZiNTU2IiwiZW52IjoicHJvZCIsImlhdCI6MTcwMTQzNjA4MywiZXhwIjoxNzAzMjM2MDgzLCJzdWIiOiIzY2E3NjA4OS00NDI3LTQ2NDAtYmE3MS04YTVhY2EwZmI1NTYifQ.NYS6Eab9__ARvRns0l5wXFOwkrONu0wvP_lG1suWABY'
      }}
      const newPrivaders = [...new Map(contrs.map(( item  => [item.NAME_PROVIDER,item]))).values()]
      console.log(newPrivaders);

      for (let contr of newPrivaders) {
        if (contr.INN_PROVIDER === "") {
          contr.INN_PROVIDER = null
        }
        try {
          let data = JSON.stringify({
            query: `mutation ren($inn: String, $name: String){CreateEntity(input:{inn:$inn,name:$name,select:SUPPLIER,full_name:$name}){id}}`,
            variables: { 
            inn:contr.INN_PROVIDER, 
            name:contr.NAME_PROVIDER
          }
        });

        console.log(data);
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://api.entersight.ru/graphql',
          headers:head.headers,
          data : data
        };

      
        const rez = await axios.request(config); 
        console.log(rez.data)
      } catch (err) { 
        console.log(err);
      }
      }
  }
  
  async AddPlu(Body: any) {
    const products = Body.RecordSet;

    const head = {headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYjQ0MDlhZTctMTFhNC00NGNlLTgzMTctYTI5MDFhYTNkM2M5IiwiZW52IjoicHJvZCIsImlhdCI6MTcwMDU0ODY5OCwiZXhwIjoxNzAyMzQ4Njk4LCJzdWIiOiJiNDQwOWFlNy0xMWE0LTQ0Y2UtODMxNy1hMjkwMWFhM2QzYzkifQ.l7GRLuNN1_os8apG58BPxG5PtBqWiVWQZogZSsSZEV8'
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
        
        // console.log(JSON.stringify(ResponseFithId.data) + '/n'+  product["ACL_CODE"] );
        
        if (ResponseFithId.data.data.ProductSearch?.products?.[0] ) {
        let code = product.SCALE_CODE.replace("Весы гвозьди - ",'');

        if(Number(code) < 1000 && code) {
        
          let data2 = JSON.stringify({
            query: `mutation dfj($branch: ID!, $product: ID!, $plu: String, $list: ID!){
              CreatePlu(input:{branch:$branch,product:$product,plu:$plu,list:$list}){
                id
              }
            }`,
            variables: {
              "product":ResponseFithId.data.data.ProductSearch?.products?.[0].id,
              "branch":"0c2bca91-d3ed-4d45-9b37-c1b77ad7ebad",
              "plu":code,
              "list":"5aea3c07-36a7-4e06-ad70-b970602dda3f",
          }
          });

          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.entersight.ru/graphql',
            headers:head.headers,
            data : data2
          };

          // console.log(data2)
          try {
          const rez = await axios.request(config).catch(function (error) {
            if (error.response) {
              // Запрос был сделан, и сервер ответил кодом состояния, который
              // выходит за пределы 2xx
              console.log(error.response.data); 
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              // Запрос был сделан, но ответ не получен
              // `error.request`- это экземпляр XMLHttpRequest в браузере и экземпляр
              // http.ClientRequest в node.js
              console.log(error.request);
            } else {
              // Произошло что-то при настройке запроса, вызвавшее ошибку
              console.log('Error', error.message);
            }
            console.log(error.config);
          });;
        } catch {
          
        }
        } else {
          // console.log('bad code')
        }
      }
    }
  }

  getHello(): string {


    
    return 'Hello World!';
  }

  async AddAlcocode(Body){

    const products = Body.RecordSet;
    
    console.log(products);
    const head = {headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZTI5YWQ1ZTMtN2E0Ni00Mjg0LWJhYTktNDQxMWZlNGVkNjRlIiwiZW52IjoicHJvZCIsImlhdCI6MTY4NDE1ODA0NSwiZXhwIjoxNjg1OTU4MDQ1LCJzdWIiOiJlMjlhZDVlMy03YTQ2LTQyODQtYmFhOS00NDExZmU0ZWQ2NGUifQ.LPLKcb_mdmL-Mqbvl9PSOUimTzFGeP_JYnNqdzqzhYE'
    }}

    for (const product of products) {
      if (product.SCALE_CODE) {
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
        
        console.log(JSON.stringify(ResponseFithId.data.ProductSearch.products[0]));
        
        if (ResponseFithId.data.data.ProductSearch?.products?.[0] ) {
          if ( product["SCALE_CODE"] != "" ) {

            let masOfCode = product["SCALE_CODE"].split(' / ').replace("/");

            masOfCode = masOfCode.map((code) => {
              const codeStart = code.split(' - ').replace("/")[0];
              console.log(codeStart, 'code start')
            })
            
            for (const code of masOfCode) {
              let DataForAlcode = JSON.stringify({
                query: `mutation dfj($branch: ID!, $product: ID!, $plu: String, $list: ID!){
                  CreatePlu(input:{branch:$branch,product:$product,plu:$plu,list:$list}){
                    id
                  }
                }`,
                variables: {branch:"0c2bca91-d3ed-4d45-9b37-c1b77ad7ebad",list:"5aea3c07-36a7-4e06-ad70-b970602dda3f",plu:"","product":ResponseFithId.data.data.ProductSearch.products[0].id}
              });

              let configForAlcode = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://api.entersight.ru/graphql',
                headers: head.headers,
                data : DataForAlcode
              };

              // let responceAboutCreateAlcode = axios.request(configForAlcode)
              // console.log((await responceAboutCreateAlcode).data);
            }
          } else {
            console.log("non plu code");
          }
        } else {
          'don foud product'
        }
      }
    }
  }

  async AddBarcode(Body){

    const products : Array<object> = Body.RecordSet;
    
    // console.log(products);
    const head = {headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYjQ0MDlhZTctMTFhNC00NGNlLTgzMTctYTI5MDFhYTNkM2M5IiwiZW52IjoicHJvZCIsImlhdCI6MTY5OTkzMjMyMywiZXhwIjoxNzAxNzMyMzIzLCJzdWIiOiJiNDQwOWFlNy0xMWE0LTQ0Y2UtODMxNy1hMjkwMWFhM2QzYzkifQ.y-kYGyvnCCTrLS4HgHrPgW5q0J6Mfbu6MrHUvAO15Sw'
    }}


    for (const product of products) {

  
      {
        let data = JSON.stringify({
        query: `query FindProductByArticle($articul : String!, $branch : String!){
        ProductSearch(input:{name:$articul,branch:$branch}){
          products{name,id,articul}
        }
      }`,
        variables: {"articul":product["ARTICUL"]
        ,"branch":'0c2bca91-d3ed-4d45-9b37-c1b77ad7ebad'}
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.entersight.ru/graphql',
        headers:head.headers,
        data : data
      };

      const ResponseFithId = await axios.request(config);
      console.log(ResponseFithId.data.data.ProductSearch?.products[0]?.id);
      
      // console.log(JSON.stringify(ResponseFithId.data) + '/n'+  product["BARCODE"] );
      
      if (ResponseFithId.data.data.ProductSearch?.products[0] && ResponseFithId.data.data.ProductSearch?.products[0].articul == product["ARTICUL"]) {
        if ( product["BARCODE"] != "" ) {

          const masOfCode = product["BARCODE"].split(' / ').map(el => {
            return el.replace('/','').trim();
          })
          const packages = masOfCode.map(el => {
            return {
              value:1,
              barcode:{
                barcode:el
              }
            }
          })


          masOfCode.map(async element => {
            if (!ResponseFithId.data.data.ProductSearch.products[0].package){
                let data = JSON.stringify({
                  query: `
                  mutation avebos($prId: ID,$code:String){
                    CreatePackage(input:{product:$prId,barcode:{barcode:$code},value:1}){
                      id
                    }
                  }`,
                    variables:{
                      code:element,
                      prId:ResponseFithId.data.data.ProductSearch.products[0].id,
                    }
                });
    
                console.log(data)
    
                let config = {
                  method: 'post',
                  maxBodyLength: Infinity,
                  url: 'https://api.entersight.ru/graphql',
                  headers:head.headers,
                  data : data
                };
    
                try{
                let responceAboutCreateAlcode = await axios.request(config)
                console.log(await responceAboutCreateAlcode.data); 
                } catch(err) {
                  console.log(err)
                } 
              }
            });
          
            //  return console.log(await responceAboutCreateAlcode);
        } else {
          console.log("non barcode");
        }
      } else {
        'don foud prod'
      }
    }
  }
}
}