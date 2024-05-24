
const AppError = require("../utills/AppError");

class UsersController{
  create(request,response){
    const {name,email,senha}= request.body;

    if(!name){
      throw new AppError ("Nome é obrigatório");
    }

    response.status(201).json({name,email,senha});
  }
}
module.exports=UsersController;