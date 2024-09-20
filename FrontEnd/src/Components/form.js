import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { usePage, useUser } from "../pageContext";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Form = () => {
  const alertWarnUser = () => {
    toast.warn("Usuario no encontrado");
  };

  const alertWarnPass = () => {
    toast.warn("Contraseña incorrecta");
  };

  const alertError = () => {
    toast.error("Ocurrió un error al intentar iniciar sesión");
  };

  const [user, setUser] = useState([]);

  const { setUser: setContextUser } = useUser();
  const { setPage: setContextPage } = usePage();

   const [passwordVisible, setPasswordVisible] = useState(false);

   const togglePasswordVisibility = () => {
     setPasswordVisible(!passwordVisible);
   };

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
        alertWarnUser()
      } else if (Password.data.length === 0) {
        alertWarnPass()
      } else {
        setContextUser(NombreUsuario.data[0]);
        console.log(NombreUsuario.data[0]);
        setContextPage("Gate");
      }
    } catch (error) {
      console.error(error);
      alertError()
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <ToastContainer />
      {/* Barra de navegación */}
      <nav className="navbar navbar-expand-lg navbar-dark z-3  w-100 bg-dark">
        <div className="container px-lg-5 d-flex justify-content-center">
          <Link
            onClick={() => setContextPage("Gate")}
            className="text-warning navbar-brand"
          >
            GameShop
            <FontAwesomeIcon icon={faArrowLeft} className="ms-4" />
          </Link>
        </div>
      </nav>
      {/* formulario de inicio */}
      <div className="d-flex justify-content-center align-items-center m-1 p-5 flex-grow-1">
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
            <div className="position-relative">
              <Link
                className="z-0 position-absolute top-50 start-100 translate-middle"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? (
                  <FontAwesomeIcon icon={faEyeSlash} className="me-5" />
                ) : (
                  <FontAwesomeIcon icon={faEye} className="me-5" />
                )}
              </Link>
              <input
                type={passwordVisible ? "text" : "password"}
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
    </div>
  );
};
export default Form;
