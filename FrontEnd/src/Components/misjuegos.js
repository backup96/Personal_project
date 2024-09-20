import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { usePage, useUser } from "../pageContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MisJuegos = () => {
  const alertSuccess = () => {
    toast.success("Licencias vendidas satisfactoriamente");
  };
  const { user } = useUser();
  const { page } = usePage();
  const { setUser: setContextUser } = useUser();
  const { setPage: setContextPage } = usePage();

  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [dataE, setDataE] = useState({
    Nombre: "",
    Categoria: "",
    Tamaño: "",
    Pe: 0,
    CantLicenciasDisponibles: "",
    CantLicenciasVendidas: "",
    Imagen: "",
    id: "",
    idDueño: "",
  });

  const [car, setCarrito] = useState({
    id: "",
    idDueño: "",
    CantLicenciasDisponibles: 0,
    OldCant: 0,
    Cantidad: 0,
  });

  useEffect(() => {
    async function fetchJuegos() {
      try {
        const response = await axios.get(
          `http://localhost:5000/MisJuegos?idDueño=${user.id}`
        );
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

  const vender = async (e) => {
    e.preventDefault();
    try {
      const verResponse = async (cur) => {
        if (cur.id === car.id) {
          await axios.patch(`http://localhost:5000/Juegos/${car.id}`, {
            CantLicenciasDisponibles:
              parseInt(cur.CantLicenciasDisponibles) + parseInt(car.Cantidad),
            CantLicenciasVendidas:
              parseInt(cur.CantLicenciasVendidas) - parseInt(car.Cantidad),
          });
          console.log(cur.CantLicenciasDisponibles);
          console.log(car.Cantidad);
        }
      };

      const upMyGames = await axios.patch(
        `http://localhost:5000/MisJuegos/${car.id}`,
        {
          Cantidad: car.OldCant - car.Cantidad,
        }
      );
      data2.map((cur) => verResponse(cur));
      if (car.Cantidad - car.OldCant === 0) {
        const response1 = await axios.delete(
          `http://localhost:5000/MisJuegos/${car.id}`
        );
        setData((prevData) =>
          prevData.filter((item) => (item.id !== car.id ? item : null))
        );
      }
      alertSuccess()
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al intentar agregar el juego al carrito");
    }
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
      <nav className="navbar navbar-expand-lg navbar-dark z-3 position-fixed w-100 bg-dark">
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
                  <li className="nav-item">
                    <button
                      onClick={() => setContextPage("Carrito")}
                      type="button"
                      className="btn btn-primary"
                    >
                      <FontAwesomeIcon icon={faCartShopping} />
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item me-3">
                    <button
                      onClick={() => setContextPage("Carrito")}
                      type="button"
                      className="btn btn-primary"
                    >
                      <FontAwesomeIcon icon={faCartShopping} />
                    </button>
                  </li>
                  <li>
                    <button
                      className="btn btn-danger"
                      href="Acción"
                      onClick={() => logOut()}
                    >
                      Cerrar sesión{" "}
                      <FontAwesomeIcon icon={faRightFromBracket} />
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      {/* Titulos*/}
      <div className="mb-5 mx-5 flex-grow-1">
        <div className="text-warning text-center fs-1 fw-bolder">TITULOS</div>
        {/* Mis Juegos */}
        <div
          id="Acción"
          className="z-0 position-absolute rounded-4 bg-warning px-4 py-2 ms-5 mt-4"
        >
          <span className="fw-bolder">Mis Juegos</span>
        </div>
        <div className="d-flex flex-row justify-content-around flex-wrap mt-5 py-4 border rounded-4 border-warning">
          {data.length > 0 ? (
            data.map((record, index) => (
              <div key={index} className="p-4">
                <div className="card" style={{ width: "18rem" }}>
                  <img src={record.Imagen} className="card-img-top" alt="..." />
                  <div className="card-body">
                    <div className="py-2 pe-4">
                      <button
                        type="button"
                        className="btn btn-primary ms-3 w-100"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        onClick={() => {
                          setDataE((prevJuego) => ({
                            ...prevJuego,
                            Nombre: record.Nombre,
                            Categoria: record.Categoria,
                            Tamaño: record.Tamaño,
                            Precio: record.Precio,
                            Pe: record.Pe,
                            Cantidad: record.Cantidad,
                            Imagen: record.Imagen,
                            id: record.id,
                            idDueño: record.idDueño,
                          }));
                        }}
                      >
                        Ver
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-100 h-100 mx-5 p-5 d-flex justify-content-center rounded-4 bg-dark">
              <div className="text-light fs-1">No hay juegos comprados</div>
            </div>
          )}
        </div>
      </div>
      {/* modals */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog  modal-lg">
          <div data-bs-theme="dark" className="modal-content bg-dark">
            <div className="modal-header">
              <h1
                className="modal-title fs-5 text-light"
                id="exampleModalLabel"
              >
                Mis juegos
              </h1>
              <button
                type="button"
                className="btn-close btn-light"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="d-flex">
                <div className="w-50">
                  <ul>
                    <li className="list-group-item p-2 text-light">
                      {dataE.Nombre}
                    </li>
                    <li className="list-group-item p-2 text-light">
                      Categoria:{" "}
                      <span
                        className={
                          dataE.Categoria === "Accion"
                            ? "text-danger"
                            : dataE.Categoria === "Deportes"
                            ? "text-success"
                            : dataE.Categoria === "Puzzle"
                            ? "text-primary"
                            : null
                        }
                      >
                        {dataE.Categoria}
                      </span>
                    </li>
                    <li className="list-group-item p-2 text-light">
                      Tamaño:
                      {` ${dataE.Tamaño} `}
                      GB
                    </li>
                    <li className="list-group-item p-2 text-light">
                      Precio: ${` ${dataE.Pe} `}
                      COP
                    </li>
                    <li className="list-group-item p-2 text-light">
                      Cant. copias compradas:{` ${dataE.Cantidad} `}
                    </li>
                    <li className="list-group-item p-2">
                      <div className="fs-4 text-light d-flex flex-row aling-items-center">
                        <p>Cantidad:</p>
                        <button
                          type="button"
                          className={`btn btn-primary p-0 mx-3 ${
                            car.Cantidad === 0 ? "disabled" : ""
                          }`}
                          style={{ width: "30px", height: "30px" }}
                          onClick={() =>
                            setCarrito({ ...car, Cantidad: car.Cantidad - 1 })
                          }
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>{" "}
                        {car.Cantidad}
                        <button
                          type="button"
                          className={`btn btn-success p-0 mx-3 ${
                            car.Cantidad === dataE.Cantidad ? "disabled" : ""
                          }`}
                          style={{ width: "30px", height: "30px" }}
                          onClick={() =>
                            setCarrito({ ...car, Cantidad: car.Cantidad + 1 })
                          }
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="w-50">
                  <img
                    src={dataE.Imagen}
                    className="items-center w-100"
                    alt="..."
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <form onSubmit={vender}>
                <button
                  onClick={() =>
                    setCarrito((prevCarrito) => ({
                      ...prevCarrito,
                      id: dataE.id,
                      CantLicenciasDisponibles: dataE.CantLicenciasDisponibles,
                      idDueño: dataE.idDueño,
                      OldCant: dataE.Cantidad,
                    }))
                  }
                  type="submit"
                  data-bs-dismiss="modal"
                  className={`btn btn-success ${
                    car.Cantidad === 0 ? "disabled" : ""
                  }`}
                >
                  Vender juego
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/*footer*/}
      <div className="py-5 bg-dark text-white text-center">
        <p className="lead">Todos los derechos reservados</p>
        <p className="lead">Joan David Moreno Guzman</p>
        <p className="lead">2024</p>
      </div>
    </div>
  );
};
export default MisJuegos;
