import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { usePage, useUser } from "../pageContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Carrito = () => {
  const alertWarn = () => {
    toast.warn("Para comprar inicie sesión primero");
  };
  const alertErrorApi = () => {
    toast.warn("Ocurrió un error al realizar la operación");
  };
  const alertError = () => {
    toast.error("Error al obtener los juegos");
  };

  const alertSuccessDel = () => {
    toast.success("Juego removido");
  };

  const alertSuccessbuy = () => {
    toast.success("Juego comprado");
  };
  const { user } = useUser();
  const { setUser: setContextUser } = useUser();
  const { setPage: setContextPage } = usePage();
  const [accion, setAccion] = useState("");

  const logOut = () => {
    setContextUser(null);
    setContextPage("Form");
  };

  const [juego, setJuegoCarrito] = useState({
    Nombre: "",
    Imagen: "",
    Categoria: "",
    Pe: 0,
    Tamaño: "",
    id: "",
    idDueño: "",
    Cantidad: 0,
  });

  const [data, setData] = useState([]);

  async function fetchJuegos() {
    try {
      const response = await axios.get(`http://localhost:5000/Carrito`);
      setCarrito(response.data);
    } catch (error) {
      alertError()
    }
  }

  const setCarrito = (data) => {
    setData(data);
  };

  useEffect(() => {
    fetchJuegos();
  }, []);

  const total = (data) => {
    let sumAccion = 0;
    let sumDeport = 0;
    let sumPuzzle = 0;
    let pretot = 0;
    let desc = 0;
    let subTotal = 0;
    data.forEach((cur) => {
      if (cur.Categoria === "Accion") {
        sumAccion = sumAccion + cur.Cantidad;
        pretot = pretot + cur.Pe * cur.Cantidad;
      } else if (cur.Categoria === "Deportes") {
        sumDeport = sumDeport + cur.Cantidad;
        pretot = pretot + cur.Pe * cur.Cantidad;
      } else if (cur.Categoria === "Puzzle") {
        sumPuzzle = sumPuzzle + cur.Cantidad;
        pretot = pretot + cur.Pe * cur.Cantidad;
      }
    });

    if (sumPuzzle >= 25) {
      desc = (pretot * 20) / 100;
    } else if (sumAccion >= 15 && sumDeport >= 20) {
      desc = (pretot * 15) / 100;
    }

    subTotal = pretot - desc;

    return { pretot, desc, subTotal };
  };

  const enviar = async (e) => {
    e.preventDefault();
    try {
      if (accion === "Eliminar") {
        if (juego.id) {
          const response = await axios.delete(
            `http://localhost:5000/Carrito/${juego.id}`
          );
          setData((prevData) =>
            prevData.filter((item) => (item.id !== juego.id ? item : null))
          );
          if (response.status === 200) {
            alertSuccessDel()
            setAccion("");
          }
        }
      } else if (accion === "Insertar") {
        const verResponse = await axios.get(`http://localhost:5000/MisJuegos`);
        const response1 = async (cur) => {
          const val = verResponse.data.filter((juego) => juego.id === cur.id);
          if (val.length > 0) {
            const response3 = await axios.patch(
              `http://localhost:5000/MisJuegos/${cur.id}`,
              {
                Cantidad: val[0].Cantidad + cur.Cantidad,
              }
            );
            const response2 = await axios.delete(
              `http://localhost:5000/Carrito/${cur.id}`
            );

            const response4 = await axios.patch(
              `http://localhost:5000/Juegos/${cur.id}`,
              {
                CantLicenciasDisponibles:
                  cur.CantLicenciasDisponibles - cur.Cantidad,
                CantLicenciasVendidas:
                  parseInt(cur.CantLicenciasVendidas) + parseInt(cur.Cantidad),
              }
            );
          } else {
            await axios.post(`http://localhost:5000/MisJuegos`, {
              Nombre: cur.Nombre,
              Imagen: cur.Imagen,
              Categoria: cur.Categoria,
              Pe: cur.Pe,
              Tamaño: cur.Tamaño,
              id: cur.id,
              idDueño: user.id,
              Cantidad: cur.Cantidad,
              CantLicenciasDisponibles:
                cur.CantLicenciasDisponibles - cur.Cantidad,
            });

            const response2 = await axios.delete(
              `http://localhost:5000/Carrito/${cur.id}`
            );

            const response3 = await axios.patch(
              `http://localhost:5000/Juegos/${cur.id}`,
              {
                CantLicenciasDisponibles:
                  cur.CantLicenciasDisponibles - cur.Cantidad,
                CantLicenciasVendidas:
                  parseInt(cur.CantLicenciasVendidas) + parseInt(cur.Cantidad),
              }
            );
          }
        };

        data.forEach((cur) => response1(cur));
        setData([]);
        alertSuccessbuy()
      }
    } catch (error) {
      console.error(error);
      alertErrorApi()
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

  const addLic = async (cur, cantAct) => {
    try {
      await axios.patch(`http://localhost:5000/Carrito/${cur}`, {
        Cantidad: cantAct + 1,
      });
      setData((prevData) =>
        prevData.map((item) =>
          item.id === cur ? { ...item, Cantidad: cantAct + 1 } : item
        )
      );
    } catch (error) {
      console.error("Error al actualizar la cantidad");
    }
  };

  const delLic = async (cur, cantAct) => {
    try {
      await axios.patch(`http://localhost:5000/Carrito/${cur}`, {
        Cantidad: cantAct - 1,
      });
      setData((prevData) =>
        prevData.map((item) =>
          item.id === cur ? { ...item, Cantidad: cantAct - 1 } : item
        )
      );
    } catch (error) {
      console.error("Error al actualizar la cantidad");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <ToastContainer />
      {/* Barra de navegación */}
      <nav className="navbar navbar-expand-lg navbar-dark  w-100 bg-dark">
        <div className="container px-lg-5">
          <Link
            onClick={() => setContextPage("Gate")}
            className="text-warning navbar-brand"
          >
            GameShop
            <FontAwesomeIcon icon={faArrowLeft} className="ms-4" />
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
                </>
              ) : (
                <>
                  <li className="nav-item dropdown mx-3">
                    <Link
                      className="btn btn-warning"
                      to="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <FontAwesomeIcon icon={faUser} />
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
            <div className="rounded-4 bg-dark m-4 p-4">
              <div>
                <div class="card-body">
                  <blockquote class="blockquote my-3">
                    <p className="text-light fs-1">
                      Aun no hay juegos en el carrito
                    </p>
                  </blockquote>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-4 bg-dark m-4 p-4">
              {data.map((record, index) => (
                <>
                  <div
                    key={index}
                    class={
                      record.Categoria === "Accion"
                        ? "border border-danger rounded-4 bg-dark m-4 p-4 card d-flex flex-row align-items-center bg-dark"
                        : record.Categoria === "Deportes"
                        ? "border border-success rounded-4 bg-dark m-4 p-4 card d-flex flex-row align-items-center bg-dark"
                        : record.Categoria === "Puzzle"
                        ? "border border-primary rounded-4 bg-dark m-4 p-4 card d-flex flex-row align-items-center bg-dark"
                        : null
                    }
                  >
                    <div class="card-body d-flex flex-row  align-items-center">
                      <div className="me-5">
                        <img
                          src={record.Imagen}
                          width="200"
                          height="200"
                          class="rounded mx-auto"
                          alt="..."
                        />
                      </div>
                      <div className="ms-5">
                        <form onSubmit={enviar}>
                          <div className="mb-3">
                            <p
                              className={
                                record.Categoria === "Accion"
                                  ? "text-danger fs-4"
                                  : record.Categoria === "Deportes"
                                  ? "text-success fs-4"
                                  : record.Categoria === "Puzzle"
                                  ? "text-primary fs-4"
                                  : null
                              }
                            >
                              {record.Nombre}
                            </p>
                            <div className="fs-4 text-light">
                              Precio: {record.Pe}
                            </div>

                            <div className="fs-4 text-light d-flex flex-row aling-items-center">
                              <p>Cantidad:</p>
                              <button
                                type="button"
                                className={`btn btn-primary p-0 mx-3 ${
                                  record.Cantidad === 1 ? "disabled" : ""
                                }`}
                                style={{ width: "30px", height: "30px" }}
                                onClick={() =>
                                  delLic(record.id, record.Cantidad)
                                }
                              >
                                <FontAwesomeIcon icon={faMinus} />
                              </button>{" "}
                              {record.Cantidad}
                              <button
                                type="button"
                                className={`btn btn-success p-0 mx-3 ${
                                  record.Cantidad ===
                                  record.CantLicenciasDisponibles
                                    ? "disabled"
                                    : ""
                                }`}
                                style={{ width: "30px", height: "30px" }}
                                onClick={() =>
                                  addLic(record.id, record.Cantidad)
                                }
                              >
                                <FontAwesomeIcon icon={faPlus} />
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => eliminar(record.id)}
                            type="submit"
                            class="btn btn-danger px-2"
                          >
                            Eliminar
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          )}
        </div>
        <div className="w-50">
          <div className="rounded-4 bg-dark m-4 p-4 text-light">
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
            <div>
              <div className="d-flex flex-row justify-content-between text-light fs-4">
                <div>Valor de la compra:</div>
                <div className="text-end">${total(data).pretot}</div>
              </div>
              <div className="d-flex flex-row justify-content-between text-light fs-4">
                <div>Descuentos:</div>
                <div className="text-end">
                  <span className="text-danger">-</span> ${total(data).desc}
                </div>
              </div>
              <hr />
              <div className="d-flex flex-row justify-content-between text-light fs-4 mb-4">
                <div>Total:</div>
                <div className="text-end">${total(data).subTotal}</div>
              </div>

              <form onSubmit={enviar}>
                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className={`btn btn-success ${
                      data.length === 0 ? "disabled" : ""
                    }`}
                    onClick={() => {
                      if (!user) {
                        alertWarn()
                      } else {
                        setCurrentAccion("Insertar");
                      }
                    }}
                  >
                    Comprar
                  </button>
                </div>
              </form>
            </div>
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
