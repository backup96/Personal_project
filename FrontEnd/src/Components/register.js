import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { usePage } from "../pageContext";
import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [user, setUser] = useState({
    NombreUsuario: "",
    Correo: "",
    Pass: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const alertSuccessUser = () => {
    toast.success("Usuario registrado con éxito");
  };

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
          alertSuccessUser();
        }
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al intentar iniciar sesión");
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
      {/* formulario de registro */}
      <div className="flex-grow-1">
        <div className="d-flex justify-content-center align-items-center m-5 p-5">
          <form
            onSubmit={enviar}
            className="my-1 py-5 px-4 bg-dark rounded-4 w-50"
          >
            <span className="text-warning text-center fs-4 fw-bold">
              Sing up
            </span>
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
                ;
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
export default Register;
