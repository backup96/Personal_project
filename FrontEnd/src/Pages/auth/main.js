import Carrito from "../../Components/carrito.js";
import Form from "../../Components/form.js";
import Gate from "../../Components/gate";
import MisJuegos from "../../Components/misjuegos.js";
import Register from "../../Components/register.js";
import wall from "../../img/wall.jpg";
import { usePage } from "../../pageContext.js";

const Main = () => {
  const { page } = usePage();
  return (
    <div
      style={{
        backgroundImage: `url(${wall})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      {page === "Form" ? (
        <Form />
      ) : page === "Gate" ? (
        <Gate />
      ) : page === "Carrito" ? (
        <Carrito />
      ) : page === "Register" ? (
        <Register />
      ) : page === "MisJuegos" ? (
        <MisJuegos />
      ) : null}
    </div>
  );
};

export default Main;
