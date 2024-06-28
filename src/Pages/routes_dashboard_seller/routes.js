import Category from "../dashboard_seller_pages/Category";
import AddCategory from "../dashboard_seller_pages/addcategory";
import Dashboard from "../dashboard_seller_pages/Dashboard";
import Product from "../dashboard_seller_pages/Product";
import AddProduct from "../dashboard_seller_pages/addproduct";
import Branch from "../dashboard_seller_pages/Branch";
import AddBranch from "../dashboard_seller_pages/addbranch";
import MyStore from "../dashboard_seller_pages/MyStore";
import EditProduct from "../dashboard_seller_pages/editproduct";
import EditCategory from "../dashboard_seller_pages/editcategory";
import EditBranch from "../dashboard_seller_pages/editbranch";
import MyProfile from "../../Components/components_register_login_seller/SellerProfile";
import ChangePassword from "../../Components/components_register_login_seller/ChangePassword";
const routes = [
    { path: '/seller', exact: true, name: 'Seller' },
    { path: '/Product', exact: true, name: 'product', component: Product },
    { path: '/Product/Add', exact: true, name: 'addproduct', component: AddProduct },
    { path: '/Product/EditProduct/:id', exact: true, name: 'editproduct', component: EditProduct },
    { path: '/Category', exact: true, name: 'category', component: Category },
    { path: '/Category/Add', exact: true, name: 'addcategory', component: AddCategory },
    { path: '/Category/EditCategory/:id', exact: true, name: 'editcategory', component: EditCategory },
    { path: '/Branch', exact: true, name: 'branch', component: Branch },
    { path: '/Branch/Add', exact: true, name: 'addbranch', component: AddBranch },
    { path: '/Branch/EditBranch/:id', exact: true, name: 'editbranch', component: EditBranch },
    { path: '/Dashboard', exact: true, name: 'dashboard', component: Dashboard },
    { path: '/MyStore', exact: true, name: 'mystore', component: MyStore },
    { path: '/MyProfile/', exact: true, name: 'myprofile', component: MyProfile },
    { path: '/ChangePassword/', exact: true, name: 'changepassword', component: ChangePassword },





];


export default routes;