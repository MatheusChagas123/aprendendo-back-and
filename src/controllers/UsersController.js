const { hash,compare } = require("bcryptjs");
const AppError = require("../utills/AppError");
const sqliteConnection = require("../database/sqlite");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;
    const database = await sqliteConnection();
    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?);", [email]);
    
    if (checkUserExists) {
      throw new AppError("Este e-mail já está em uso.");
    }

    const hashedPassword = await hash(password, 8);

    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return response.status(201).json();
  }
  // alterar nome, senha, email, tem que colocar a senha antiga tbm.
  async update(request, response) {
    const { name, email, password,old_password} = request.body;
    const { id } = request.params;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?);", [id]);
    //usuaario não encontrado
    if (!user) {
      throw new AppError("Usuário não encontrado");
    }

    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?);", [email]);
    // tentar mudar contas de um e-mail de outra conta
    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este e-mail está em uso");
    }
    // tentar mudar sem a senha antinga
    user.name = name;
    user.email = email;
   if(password  && !old_password){
    throw new AppError("Você precisa informar a senha antiga para atualizar a senha");
    if(password && old_password){
      const checkOldPassword = await compare(old_password,user.password);
      if(!checkOldPassword){
        throw new AppError("a senha antinga não está correta");
      }
    }
    
   }
    // aqui ta alterando os dados
    await database.run(`
      UPDATE users SET 
      name = ?, 
      email = ?, 
      updated_at = ?
      WHERE id = ?
    `, [
      user.name,
      user.email,
      new Date(),
      id
    ]);

    return response.status(200).json();
  }
}

module.exports = UsersController;
