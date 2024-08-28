import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { usePage, useUser } from "../pageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";

library.add(faTrash);
library.add(faPenToSquare);
library.add(faSquarePlus);

const Carrito = () => {
  const { user } = useUser();
  const { setUser: setContextUser } = useUser();
  const { setPage: setContextPage } = usePage();

  const [data, setData] = useState([]);

  const [accion, setAccion] = useState("");

  const [juegoCarrito, setJuegoCarrito] = useState({
    id: "",
  });

  useEffect(() => {
    async function fetchJuegos() {
      try {
        const response = await axios.get(`http://localhost:4000/Carrito`);
        setData(response.data);
      } catch (error) {
        alert("Error al obtener los juegos");
      }
    }
    fetchJuegos();
  }, []);

  const logOut = () => {
    setContextUser(null);
    setContextPage("Form");
    alert("Ha cerrado sesion");
  };

  const enviar = async (e) => {
    e.preventDefault();
    
      alert("hola");
    try {
      if (accion === "Eliminar") {
        if (juegoCarrito.id) {
          const response = await axios.delete(
            `http://localhost:4000/Carrito/${juegoCarrito.id}`
          );  
          console.log(response.status);
          if (response.status === 200) {
            setAccion("");
          }
        }
      } else if (accion === "Insertar") {
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al realizar la operación");
    }
  };

  const eliminar = (record) => {
    const confir = window.confirm(
      "¿ Esta seguro de quitar este juego de su lista ?"
    );
    if (confir) {
      setJuegoCarrito((prevJuegoCarrito) => ({
        ...prevJuegoCarrito,
        id: record,
      }));
      setAccion(() => "Eliminar");
    }
  };
  return (
    <>
      {/* Barra de navegación */}
      <nav className="navbar navbar-expand-lg navbar-dark  w-100 bg-dark">
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
              <li className="nav-item dropdown mx-3">
                <Link
                  className="text-warning nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Categorías
                </Link>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="text-danger dropdown-item" href="Acción">
                      Accion
                    </Link>
                  </li>
                  <li>
                    <Link className="text-primary dropdown-item" href="#">
                      Puzzles
                    </Link>
                  </li>
                  <li>
                    <Link className="text-success dropdown-item" href="#">
                      Deportes
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <form className="d-flex" role="search">
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <button className="btn btn-outline-success" type="submit">
                    Search
                  </button>
                </form>
              </li>
              {!user ? (
                <li className="nav-item mx-2">
                  <button
                    onClick={() => setContextPage("Form")}
                    type="button"
                    className="btn btn-warning"
                  >
                    Iniciar Sesion
                  </button>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <button
                      onClick={() => setContextPage("Gate")}
                      type="button"
                      className="btn btn-danger ms-3"
                    >
                      Inicio
                    </button>
                  </li>
                  <li className="nav-item dropdown mx-3">
                    <Link
                      className="btn btn-warning"
                      to="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Perfil
                    </Link>
                    <ul className="dropdown-menu">
                      <li>
                        <button
                          className="text-danger dropdown-item"
                          href="Acción"
                          onClick={() => logOut()}
                        >
                          Cerrar sesion
                        </button>
                      </li>
                      <li>
                        <Link className="text-primary dropdown-item" href="#">
                          Ver mis juegos
                        </Link>
                      </li>
                    </ul>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="rounded-4 bg-dark m-5 p-5">
        {data.map((record, index) => (
          <div
            key={index}
            class={
              record.Categoria === "Accion"
                ? "border border-danger rounded-4 bg-dark m-5 p-5 card d-flex flex-row align-items-center bg-dark"
                : record.Categoria === "Deportes"
                ? "border border-success rounded-4 bg-dark m-5 p-5 card d-flex flex-row align-items-center bg-dark"
                : record.Categoria === "Puzzle"
                ? "border border-primary rounded-4 bg-dark m-5 p-5 card d-flex flex-row align-items-center bg-dark"
                : null
            }
          >
            <div class="card-body">
              <blockquote class="blockquote my-3">
                <p
                  className={
                    record.Categoria === "Accion"
                      ? "text-danger"
                      : record.Categoria === "Deportes"
                      ? "text-success"
                      : record.Categoria === "Puzzle"
                      ? "text-primary"
                      : null
                  }
                >
                  {record.Nombre}
                </p>
                <footer class="blockquote-footer">{record.Precio}</footer>
              </blockquote>
            </div>
            <div className="pe-4">
              <form>
                <div className="mb-3">
                  <input
                    placeholder="Cantidad"
                    type="number"
                    className="form-control"
                    id="exampleInputPassword1"
                  />
                </div>
                <button type="submit" className="btn btn-success me-5">
                  Comprar
                </button>
                <form className="p-0" onSubmit={enviar}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      eliminar(record.id);
                    }}
                    type="submit"
                    class="btn btn-danger px-2"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </form>
              </form>
            </div>
          </div>
        ))}
      </div>

      {/*footer*/}
      <div className="py-5 bg-dark text-white text-center">
        <p className="lead">Todos los derechos reservados</p>
        <p className="lead">Joan David Moreno Guzman</p>
        <p className="lead">2024</p>
      </div>
    </>
  );
};
export default Carrito;
