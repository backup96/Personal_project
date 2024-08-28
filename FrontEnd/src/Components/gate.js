import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { usePage, useUser } from "../pageContext";
const Gate = () => {
  const { user } = useUser();
  const { setUser: setContextUser } = useUser();
  const { setPage: setContextPage } = usePage();

  const [data, setData] = useState([]);
  const [dataE, setDataE] = useState({
    Nombre: "",
    Categoria: "",
    Tamaño: "",
    Precio: "",
    CantLicenciasDisponibles: "",
    CantLicenciasVendidas: "",
    Imagen: "",
  });
  const [car, setCarrito] = useState({
    Nombre: "",
    Categoria: "",
    Precio: "",
    Pe: 0,
    Cantidad: 0,
    idDueño: 0,
  });
  useEffect((dataCarrito) => {
    async function fetchJuegos() {
      try {
        const response = await axios.get(
          `http://localhost:4000/Juegos?_sort=CLV&_order=asc`
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

  const carrito = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Para ir al carrito, inicie sesion primero");
      setContextPage("Form");
    } else {
      try {
        const verResponse = await axios.get(`http://localhost:4000/Carrito/`);
        const val = verResponse.data.filter(
          (juego) =>
            juego.Nombre === car.Nombre && juego.idDueño === user.idUser
        );
        if (val.length > 0) {
          alert("Este juego ya esta en tu carrito");
        } else {
          const response = await axios.post(
            `http://localhost:4000/Carrito`,
            car
          );
          if (response.status === 201) {
            alert("Juego agregado correctamente");
          }
        }
      } catch (error) {
        console.error(error);
        alert("Ocurrió un error al intentar agregar el juego al carrito");
      }
    }
  };
  const mostWanted = data.slice(data.length - 5, data.length);
  return (
    <>
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
                      onClick={() => setContextPage("Carrito")}
                      type="button"
                      className="btn btn-primary ms-3"
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
      {/* Carrusel de imágenes*/}
      <div className="d-flex align-items-center flex-column bg-black pt-5">
        <div className="text-warning  fs-1 mt-5 fw-bolder">MAS VENDIDOS</div>
        <div id="carouselExample" className="carousel slide w-50 mb-5">
          <div className="carousel-inner">
            {mostWanted.map((record, index) => (
              <div
                key={index}
                className={
                  index === 0 ? "carousel-item active" : "carousel-item"
                }
              >
                <div className="text-warning text-center fs-1 fw-bolder mb-2">
                  {record.CantLicenciasVendidas} de copias vendidas
                </div>
                <img
                  src={record.Imagen}
                  className="d-block mx-auto w-50"
                  alt="logo1"
                />
                <div className="text-warning text-center fs-1 mt-5 fw-bolder">
                  {record.Nombre}
                </div>
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      {/* Titulos*/}
      <div className="m-5">
        <div className="text-warning text-center fs-1 fw-bolder">TITULOS</div>
        {/* Acción */}
        <div
          id="Acción"
          className="z-0 position-absolute rounded-4 bg-danger px-4 py-2 ms-5 mt-4"
        >
          <span className="fw-bolder">Acción</span>
        </div>
        <div className="d-flex flex-row justify-content-around flex-wrap mt-5 py-4 border rounded-4 border-danger">
          {data.map((record, index) =>
            record.Categoria === "Accion" ? (
              <div key={index} className="p-4">
                <div className="card" style={{ width: "18rem" }}>
                  <img src={record.Imagen} className="card-img-top" alt="..." />
                  <div className="card-body">
                    <div className="d-flex">
                      <div className="p-2">
                        <span className="text-warning text-center fs-4 fw-bolder">
                          {record.Precio}
                          <span className="text-warning fs-5 fw-bolder">
                            {" "}
                            cop
                          </span>
                        </span>
                      </div>
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
                              CantLicenciasDisponibles:
                                record.CantLicenciasDisponibles,
                              CantLicenciasVendidas:
                                record.CantLicenciasVendidas,
                              Imagen: record.Imagen,
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
            ) : null
          )}
        </div>
        {/* Deportes */}
        <div
          id="Deportes"
          className="z-0 position-absolute rounded-4 bg-success px-4 py-2 ms-5 mt-4"
        >
          <span className="fw-bolder">Deportes</span>
        </div>
        <div className="d-flex flex-row justify-content-around flex-wrap mt-5 py-4 border rounded-4 border-success">
          {data.map((record, index) =>
            record.Categoria === "Deportes" ? (
              <div key={index} className="p-4">
                <div className="card" style={{ width: "18rem" }}>
                  <img src={record.Imagen} className="card-img-top" alt="..." />
                  <div className="card-body">
                    <div className="d-flex">
                      <div className="p-2">
                        <span className="text-warning text-center fs-4 fw-bolder">
                          {record.Precio}
                          <span className="text-warning fs-5 fw-bolder">
                            {" "}
                            cop
                          </span>
                        </span>
                      </div>
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
                              CantLicenciasDisponibles:
                                record.CantLicenciasDisponibles,
                              CantLicenciasVendidas:
                                record.CantLicenciasVendidas,
                              Imagen: record.Imagen,
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
            ) : null
          )}
        </div>
        {/* Puzzles */}
        <div
          id="Puzzles"
          className="z-0 position-absolute rounded-4 bg-primary px-4 py-2 ms-5 mt-4"
        >
          <span className="fw-bolder">Puzzles</span>
        </div>
        <div className="d-flex flex-row justify-content-around flex-wrap mt-5 py-4 border rounded-4 border-primary">
          {data.map((record, index) =>
            record.Categoria === "Puzzle" ? (
              <div key={index} className="p-4">
                <div className="card" style={{ width: "18rem" }}>
                  <img src={record.Imagen} className="card-img-top" alt="..." />
                  <div className="card-body">
                    <div className="d-flex">
                      <div className="p-2">
                        <span className="text-warning text-center fs-4 fw-bolder">
                          {record.Precio}
                          <span className="text-warning fs-5 fw-bolder">
                            {" "}
                            cop
                          </span>
                        </span>
                      </div>
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
                              CantLicenciasDisponibles:
                                record.CantLicenciasDisponibles,
                              CantLicenciasVendidas:
                                record.CantLicenciasVendidas,
                              Imagen: record.Imagen,
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
            ) : null
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
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Ventana de compra
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
                      Precio: ${` ${dataE.Precio} `}
                      COP
                    </li>
                    <li className="list-group-item p-2">
                      Cant. Licencias disponibles:
                      {` ${dataE.CantLicenciasDisponibles}`}
                    </li>
                    <li className="list-group-item p-2">
                      Cant. Licencias vendidas:
                      {` ${dataE.CantLicenciasVendidas}`}
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
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Continuar comprando
              </button>
              <form onSubmit={carrito}>
                <button
                  onClick={() =>
                    setCarrito((prevCarrito) => ({
                      ...prevCarrito,
                      Nombre: dataE.Nombre,
                      Categoria: dataE.Categoria,
                      Precio: dataE.Precio,
                      Pe: dataE.Pe,
                      Cantidad: 1,
                      idDueño: user.idUser,
                    }))
                  }
                  type="submit"
                  data-bs-dismiss="modal"
                  className="btn btn-primary"
                >
                  Añadir al carrito
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
    </>
  );
};
export default Gate;
