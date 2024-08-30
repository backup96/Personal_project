import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { usePage, useUser } from "../pageContext";
const MisJuegos = () => {
  const { user } = useUser();
  const { page } = usePage();
  const { setUser: setContextUser } = useUser();
  const { setPage: setContextPage } = usePage();

  const [data, setData] = useState([]);
  const [data2, setData2] = useState([])
  const [dataE, setDataE] = useState({
    Nombre: "",
    Categoria: "",
    Tamaño: "",
    Pe: 0,
    CantLicenciasDisponibles: "",
    CantLicenciasVendidas: "",
    Imagen: "",
    id: "",
    idDueño: ""
  });

  const [car, setCarrito] = useState({
    id: "",
    idDueño: "",
    CantLicenciasDisponibles: 0,
    OldCant: 0,
    Cantidad: 0,
  });

  useEffect((dataCarrito) => {
    async function fetchJuegos() {
      try {
        const response = await axios.get(`http://localhost:5000/MisJuegos`);
        setData(response.data);
        const response1 = await axios.get(`http://localhost:5000/Juegos`)
        setData2(response1.data)
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
        if (cur.id === car.id){
          await axios.patch(`http://localhost:5000/Juegos/${car.id}`, {
            CantLicenciasDisponibles:
              parseInt(cur.CantLicenciasDisponibles) + parseInt(car.Cantidad),
            CantLicenciasVendidas:
              parseInt(cur.CantLicenciasVendidas) - parseInt(car.Cantidad)
          }); 
          console.log(cur.CantLicenciasDisponibles);
          console.log(car.Cantidad) 
        }
        }

      const upMyGames = await axios.patch(
        `http://localhost:5000/MisJuegos/${car.id}`,
        {
          Cantidad: car.OldCant - car.Cantidad 
        }
      );
      data2.map((cur) => verResponse(cur));
      if (car.Cantidad - car.OldCant === 0) {
        const response1 = await axios.delete(
          `http://localhost:5000/MisJuegos/${car.id}`
        );
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al intentar agregar el juego al carrito");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Barra de navegación */}
      <nav className="navbar navbar-expand-lg navbar-dark z-3 position-fixed w-100 bg-dark">
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
                      Carrito
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item ms-3">
                    <button
                      onClick={() => setContextPage("Carrito")}
                      type="button"
                      className="btn btn-primary"
                    >
                      Carrito
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
                        {page === "MisJuegos" ? (
                          <Link
                            onClick={() => setContextPage("Gate")}
                            className="text-primary dropdown-item"
                            href="#"
                          >
                            Volver al inicio
                          </Link>
                        ) : (
                          <Link
                            onClick={() => setContextPage("MisJuegos")}
                            className="text-primary dropdown-item"
                            href="#"
                          >
                            Ver mis juegos
                          </Link>
                        )}
                      </li>
                    </ul>
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
          {data.map((record, index) => (
            <div key={index} className="p-4">
              <div className="card" style={{ width: "18rem" }}>
                <img src={record.Imagen} className="card-img-top" alt="..." />
                <div className="card-body">
                  <div className="d-flex">
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
                            idDueño: record.idDueño
                          }));
                        }}
                      >
                        Ver
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Mis juegos
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="d-flex">
                <div className="w-50">
                  <ul>
                    <li className="list-group-item p-2">{dataE.Nombre}</li>
                    <li className="list-group-item p-2">
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
                    <li className="list-group-item p-2">
                      Tamaño:
                      {` ${dataE.Tamaño} `}
                      GB
                    </li>
                    <li className="list-group-item p-2">
                      Precio: ${` ${dataE.Pe} `}
                      COP
                    </li>
                    <li className="list-group-item p-2">
                      Cant. copias vendidas:{` ${dataE.Cantidad} `}
                    </li>
                    <li className="list-group-item p-2">
                      <div className="d-flex flex-row justify-content-start">
                        <div className="me-3 text-success">
                          Cant. Licencias a vender:
                        </div>
                        <div className="">
                          <input
                            type="number"
                            min="0"
                            max={dataE.Cantidad}
                            className="form-control  border border-success"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            required
                            value={car.Cantidad}
                            onChange={(e) =>
                              setCarrito((prevUsuario) => ({
                                ...prevUsuario,
                                Cantidad: e.target.value,
                              }))
                            }
                          />
                        </div>
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
                      OldCant: dataE.Cantidad
                    }))
                  }
                  type="submit"
                  data-bs-dismiss="modal"
                  className="btn btn-success"
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
