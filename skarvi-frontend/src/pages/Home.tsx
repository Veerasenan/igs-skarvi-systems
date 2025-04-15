import Navbar from "../components/Navbar";
import Homeboard from "../Homeboard";
import Physicaltrades from "../Physicaltrades";
import Papertrades from "../components/Papertrades";
import Chartering from "../components/Chartering";
import Reports from "../components/Reports";
import OperationsAndLogistics from "../components/OperationsAndLogistics";
import InventoryManagement from "../components/InventoryManagement";
import EndOfDay from "../components/InventoryManagement";
import AdminTools from "../components/AdminTools";
// import Development from "../components/Development";
import AddNewTrade from "../components/Papertrades_AddNewTrade";
const Home = () => {
    return(
<>
<Navbar/>
<Homeboard/>
<Physicaltrades/>
<Papertrades/>
<Chartering/>
<Reports/>
<OperationsAndLogistics/>
<InventoryManagement/>
<EndOfDay/>
<AdminTools/>
{/* <Development/> */}
<AddNewTrade/>
</>
    );
};
export default Home;