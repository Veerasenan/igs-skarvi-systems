import Navbar from "../components/Navbar";
import Dashboard from "../Dashboard";
import Physicaltrades from "../Physicaltrades";
import Papertrades from "../components/Papertrades";
import Chartering from "../components/Chartering";
import Reports from "../components/Reports";
import OperationsAndLogistics from "../components/OperationsAndLogistics";
import InventoryManagement from "../components/InventoryManagement";
import EndOfDay from "../components/InventoryManagement";
import AdminTools from "../components/AdminTools";
import Development from "../components/Development";
const Home = () => {
    return(
<>
<Navbar/>
<Dashboard/>
<Physicaltrades/>
<Papertrades/>
<Chartering/>
<Reports/>
<OperationsAndLogistics/>
<InventoryManagement/>
<EndOfDay/>
<AdminTools/>
<Development/>
</>
    );
};
export default Home;