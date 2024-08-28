import { Link } from "react-router-dom";
import { usePage } from "../pageContext";
import axios from "axios";
import { useState } from "react";

const Register = () => {
  const [user, setUser] = useState({
    NombreUsuario: "",
    Correo: "",
    Pass: "",
  });

  const { setPage: setContextPage } = usePage();

  const enviar = async (e) => {
    e.preventDefault();

    try {
      const NombreUsuario = await axios.get(
        `http://localhost:5000/Users?NombreUsuario=${user.NombreUsuario}`
      );
      const Correo = await axios.get(
        `http://localhost:5000/Users?Correo=${user.Correo}`
      );
      const Pass = await axios.get(
        `http://localhost:5000/Users?Pass=${user.Pass}`
      );

      if (NombreUsuario.data.length > 0) {
        alert("Nombre de usuario en uso");
      } else if (Correo.data.length > 0) {
        alert("Correo ya registrado");
      } else if (Pass.data.length > 0) {
        alert("Pruebe otra contraseña");
      } else {
        const registro = await axios.post(`http://localhost:5000/Users`, {
          NombreUsuario: user.NombreUsuario,
          Correo: user.Correo,
          Pass: user.Pass,
        });
        console.log(registro.status);
        if (registro.status === 201) {
          alert("Usuario registrado con éxito");
          setContextPage("Form");
        }
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
      <div className="d-flex justify-content-center align-items-center m-5 p-5">
        <form
          onSubmit={enviar}
          className="my-1 py-5 px-4 bg-dark rounded-4 w-50"
        >
          <span className="text-warning text-center fs-4 fw-bold">Sing up</span>
          {/* Correo de usuario */}
          <div
            id="emailHelp"
            className="form-text text-warning mb-3 text-start"
          >
            <label
              htmlFor="exampleInputEmail1"
              className="form-label text-warning"
            >
              Ingrese su correo electrónico
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              required
              value={user.Correo}
              onChange={(e) =>
                setUser((prevUsuario) => ({
                  ...prevUsuario,
                  Correo: e.target.value,
                }))
              }
            />
          </div>
          {/* Nombre de usuario y contraseña */}
          <div className="d-flex flex-row">
            <div className="w-50 me-3">
              <label
                htmlFor="exampleInputEmail1"
                className="form-label text-warning"
              >
                Ingrese un nombre de usuario
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
            <div className="w-50">
              <label
                htmlFor="exampleInputEmail1"
                className="form-label text-warning"
              >
                Ingrese una Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
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
          </div>
          {/* Boton de continuar y link para volver login */}
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-warning my-3 w-100">
              Continuar
            </button>
          </div>
          <Link
            onClick={() => setContextPage("Form")}
            className="form-text text-warning mt-3 text-decoration-none fs-6 fw-bold"
          >
            ¿ Ya tiene cuenta ? Inicie sesión aquí
          </Link>
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
export default Register;
