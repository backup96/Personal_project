import { Link } from "react-router-dom";
import axios from "axios";
import { usePage, useUser } from "../pageContext";
import { useState } from "react";

const Form = () => {
  const [user, setUser] = useState({
    NombreUsuario: "",
    Correo: "",
    Pass: "",
  });
  
  const { setUser: setContextUser } = useUser();
  const { setPage: setContextPage } = usePage();

  const enviar = async (e) => {
    e.preventDefault();

    try {
      // Solicitud GET para obtener los datos del usuario
      const NombreUsuario = await axios.get(
        `http://localhost:5000/Users?NombreUsuario=${user.NombreUsuario}`
      );

      const Password = await axios.get(
        `http://localhost:5000/Users?Pass=${user.Pass}`
      );

      if (NombreUsuario.data.length === 0) {
        alert("Usuario no encontrado");
      } else if (Password.data.length === 0) {
        alert("Contraseña incorrecta");
      } else {
        alert("Inicio de sesión exitoso");
        setContextUser(user);
        setContextPage("Gate")
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al intentar iniciar sesión");
    }
  };

  return (
    <>
      {/* Barra de navegación */}
      <nav className="navbar navbar-expand-lg navbar-dark z-3  w-100 bg-dark">
        <div className="container px-lg-5">
          <Link className="text-warning navbar-brand" to="#">
            GameShop
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navConetent"
            aria-controls="navConetent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navConetent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <button
                  className="btn btn-warning"
                  href="Acción"
                  onClick={() => setContextPage("Gate")}
                >
                  Inicio
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="d-flex justify-content-center align-items-center m-1 p-5">
        <form
          onSubmit={enviar}
          className="my-1 py-5 px-4 bg-dark rounded-4 w-25"
        >
          <div className="d-flex justify-content-center">
            <span className="text-warning fs-4 fw-bold">Log in</span>
          </div>
          <div className="my-4">
            <label
              htmlFor="exampleInputEmail1"
              className="form-label text-warning"
            >
              UserName
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              required
              value={user.NombreUsuario}
              onChange={(e) =>
                setUser((prevUsuario) => ({
                  ...prevUsuario,
                  NombreUsuario: e.target.value,
                }))
              }
            />
          </div>
          <div className="my-3">
            <label
              htmlFor="exampleInputPassword1"
              className="form-label text-warning"
            >
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              required
              value={user.Pass}
              onChange={(e) =>
                setUser((prevUsuario) => ({
                  ...prevUsuario,
                  Pass: e.target.value,
                }))
              }
            />
          </div>
          <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-warning w-100 mt-3">
                Continuar
              </button>
            </div>
          <div
            id="emailHelp"
            className="form-text text-warning mt-3 text-start"
          >
            <Link
              onClick={() => setContextPage("Register")}
              className="form-text text-warning mt-3 text-decoration-none fs-6 fw-bold"
            >
              ¿ No tiene cuenta ? Cree una aquí
            </Link>
          </div>
        </form>
      </div>
      {/*footer*/}
      <div className="py-5 mt-5 bg-dark text-white text-center">
        <p className="lead">Todos los derechos reservados</p>
        <p className="lead">Joan David Moreno Guzman</p>
        <p className="lead">2024</p>
      </div>
    </>
  );
};
export default Form;
