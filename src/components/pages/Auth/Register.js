import { useState, useContext } from "react";
import Input from "../../form/input";
import styles from "../../form/Form.module.css";
import { Link } from "react-router-dom";
import { Context } from "../../../context/UserContext";
function Register() {
  const { register } = useContext(Context);
  const [user, setUser] = useState({});
  function handleOnChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // enviar o usuario para o banco
    register(user);
  }

  return (
    <section className={styles.form_container}>
      <h1>Registrar</h1>
      <form onSubmit={handleSubmit}>
        <Input
          text="Nome"
          type="text"
          name="name"
          placeholder="Digite seu nome"
          handleOnChange={handleOnChange}
        />
        <Input
          text="Telefone"
          type="text"
          name="phone"
          placeholder="Digite seu Telefone"
          handleOnChange={handleOnChange}
        />
        <Input
          text="E-mail"
          type="email"
          name="email"
          placeholder="Digite seu email"
          handleOnChange={handleOnChange}
        />
        <Input
          text="Senha"
          type="password"
          name="password"
          placeholder="Digite sua senha"
          handleOnChange={handleOnChange}
        />
        <Input
          text="Confirmção de senha"
          type="password"
          name="confirmpassword"
          placeholder="Confirme sua senha"
          handleOnChange={handleOnChange}
        />
        <input type="submit" value="Cadastrar" />
      </form>
      <p>
        Já possui conta? <Link to="/login">Clique aqui</Link>
      </p>
    </section>
  );
}
export default Register;
