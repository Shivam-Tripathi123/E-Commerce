

class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search()
  {
    const keyword=this.queryStr.keyword ? {
        name:{
            $regex:this.queryStr.keyword,
            $options:"i"//means case insensitive
        }
    }   : {};

    this.query=this.query.find({...keyword});//... is spread operator
    return this;
  }

  filter()
  {
    const queryCopy={...this.queryStr};
    //Removing some field for category
    const removeField=["keyword","page","limit"];

    removeField.forEach(a=>delete queryCopy[a]);


    let queryStr=JSON.stringify(queryCopy);
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=> `$${key}`);


    this.query=this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resultPerPage)
  {
      const currentPAge=Number(this.queryStr.page)||1
      
      const skip=resultPerPage*(currentPAge-1);

      this.query=this.query.limit(resultPerPage).skip(skip);
      return this;
  }
}

module.exports = ApiFeatures;
