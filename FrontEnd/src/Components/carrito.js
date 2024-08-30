import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { usePage, useUser } from "../pageContext";

const Carrito = () => {
  const { user } = useUser();
  const { setUser: setContextUser } = useUser();
  const { setPage: setContextPage } = usePage();
  const [accion, setAccion] = useState("");

  const logOut = () => {
    setContextUser(null);
    setContextPage("Form");
    alert("Ha cerrado sesion");
  };

  const [juego, setJuegoCarrito] = useState({
    Nombre: "",
    Imagen: "",
    Categoria: "",
    Pe: 0,
    Tamaño: "",
    id: "",
    idDueño: user.id,
    Cantidad: 0,
  });

  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchJuegos() {
      try {
        const response = await axios.get(`http://localhost:5000/Carrito`);
        setData(response.data);
      } catch (error) {
        alert("Error al obtener los juegos");
      }
    }
    fetchJuegos();
  }, []);

  const total = (data) => {
    let sumAccion = 0;
    let sumDeport = 0;
    let sumPuzzle = 0;
    let pretot = 0;
    let desc = 0;
    data.forEach((cur) => {
      if (cur.Categoria === "Accion") {
        sumAccion = sumAccion + cur.Cantidad;
        pretot = pretot + (cur.Pe * cur.Cantidad)
      } else if (cur.Categoria === "Deportes") {
        sumDeport = sumDeport + cur.Cantidad;
        pretot = pretot + (cur.Pe * cur.Cantidad)
      } else if (cur.Categoria === "Puzzle") {
        sumPuzzle = sumPuzzle + cur.Cantidad;
        pretot = pretot + (cur.Pe * cur.Cantidad)
      }
    });

    if(sumPuzzle >= 25){
      desc = ((pretot * 20 ) / 100)
    } else if (sumAccion >= 15 && sumDeport >= 20) {
      desc = (pretot * 15) / 100;
    }
    return pretot - desc;
  };

  const enviar = async (e) => {
    e.preventDefault();
    try {
      if (accion === "Eliminar") {
        if (juego.id) {
          const response = await axios.delete(
            `http://localhost:5000/Carrito/${juego.id}`
          );
          console.log(response.status);
          if (response.status === 200) {
            setAccion("");
          }
        }
      } else if (accion === "Insertar") {

        const response1 = async (cur) => {
        await axios.post(`http://localhost:5000/MisJuegos`, {
          Nombre: cur.Nombre,
          Imagen: cur.Imagen,
          Categoria: cur.Categoria,
          Pe: cur.Pe,
          Tamaño: cur.Tamaño,
          id: cur.id,
          idDueño: user.id,
          Cantidad: cur.Cantidad,
          CantLicenciasDisponibles: cur.CantLicenciasDisponibles - cur.Cantidad
        }
      );
        const response0 = await axios.get(`http://localhost:5000/Carrito/${cur.id}`)

        const response2 = await axios.delete(
          `http://localhost:5000/Carrito/${cur.id}`
        );

        const response3 = await axios.patch(
          `http://localhost:5000/Juegos/${cur.id}`,
          {
            CantLicenciasDisponibles:
              cur.CantLicenciasDisponibles - cur.Cantidad,
            CantLicenciasVendidas: parseInt(cur.CantLicenciasVendidas) + parseInt(cur.Cantidad),
          }
        );
      }
        data.forEach((cur) => response1(cur))
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al realizar la operación");
    }
  };

  const setCurrentAccion = (accion) => {
    setAccion(() => accion);
  };

  const eliminar = (record) => {
    setJuegoCarrito((prevJuego) => ({
      ...prevJuego,
      id: record,
    }));
    setAccion(() => "Eliminar");
  };

  return (
    <div className="d-flex flex-column min-vh-100">
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
              {!user ? (
                <>
                  <li className="nav-item mx-2">
                    <button
                      onClick={() => setContextPage("Form")}
                      type="button"
                      className="btn btn-warning"
                    >
                      Iniciar Sesion
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      onClick={() => setContextPage("Gate")}
                      type="button"
                      className="btn btn-danger"
                    >
                      Inicio
                    </button>
                  </li>
                </>
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
                        <Link
                          onClick={() => setContextPage("MisJuegos")}
                          className="text-primary dropdown-item"
                          href="#"
                        >
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
      {/* Contenido del carrito */}
      <div className="d-flex flex-row flex-grow-1">
        <div className="w-75">
          {data.length === 0 ? (
            <div className="rounded-4 bg-dark mx-5 my-5 p-4">
              <div>
                <div class="card-body">
                  <blockquote class="blockquote my-3">
                    <p className="text-light fs-1">
                      Aun no hay juegos en el carrito
                    </p>
                    <footer class="blockquote-footer">----</footer>
                  </blockquote>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-4 bg-dark m-5 p-5">
              {data.map((record, index) => (
                <>
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
                    <div class="card-body d-flex flex-row justify-content-between align-items-center">
                      <div>
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
                          <footer class="blockquote-footer">{record.Pe}</footer>
                        </blockquote>
                      </div>
                      <div>
                        <img
                          src={record.Imagen}
                          width="200"
                          height="200"
                          class="rounded mx-auto d-block"
                          alt="..."
                        />
                      </div>
                      <div>
                        <form onSubmit={enviar}>
                          <div className="mb-3">
                            <div className="fs-4 text-light">
                              Cantidad: {record.Cantidad}
                            </div>
                          </div>
                          <div className="d-flex flex-row ">
                            <div>
                              <button
                                onClick={() => eliminar(record.id)}
                                type="submit"
                                class="btn btn-danger px-2"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div></div>
                </>
              ))}
              <div className="d-flex flex-rwo">
                <div>
                  <div className="text-end text-light me-5 fs-3">
                    Total: ${total(data)}
                  </div>
                </div>
                <div>
                  <form onSubmit={enviar}>
                    <div className="d-flex flex-row ">
                      <div>
                        <button
                          type="submit"
                          className="btn btn-success me-5"
                          onClick={() => {
                            if (!user) {
                              alert("Para comprar inicie sesión primero");
                              setContextPage("Form");
                            } else {
                              setCurrentAccion("Insertar");
                            }
                          }}
                        >
                          Comprar
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="w-25">
          <div className="rounded-4 bg-dark m-5 p-5 text-light">
            <ul>
              <li>
                Por la compra de 25 licencias de juegos de rompecabezas obtenga
                un 20 % de descuento.
              </li>
              <li>
                Por la compra de 15 licencias de juegos de acción y 20 licencias
                de deportes obtenga un 15 % de descuento.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/*footer*/}
      <div className=" mt-5 py-5 bg-dark text-white text-center">
        <p className="lead">Todos los derechos reservados</p>
        <p className="lead">Joan David Moreno Guzman</p>
        <p className="lead">2024</p>
      </div>
    </div>
  );
};
export default Carrito;
