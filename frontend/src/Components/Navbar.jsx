import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { axiosInstance } from "../lib/axios";
import { handleSuccess } from "../lib/utils";
import { useClickOutside } from "../lib/useClickOutside";
import { CircleUser, LogOut } from "lucide-react";
 

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const burgerRef = useRef(null);
  const navigate = useNavigate();
  const [dropDown, setDropDown] = useState(false);
  const dropDownRef = useRef(null);
  const dropDownRef1 = useRef(null);

  const { isAuthenticated, user } = useAuth();

  const handleToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (
  //       menuRef.current &&
  //       !menuRef.current.contains(event.target) &&
  //       burgerRef.current &&
  //       !burgerRef.current.contains(event.target)
  //     ) {
  //       setIsMenuOpen(false);
  //     }
  //   };

  //   if (isMenuOpen) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [isMenuOpen]);

  useClickOutside(() => setIsMenuOpen(false), menuRef, burgerRef);
  useClickOutside(() => setDropDown(false), dropDownRef, dropDownRef1);

  // useClickOutside(dropDownRef, () => setDropDown(false));
  // useClickOutside(dropDownRef1, () => setDropDown(false));

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.post("/api/logout");
      if (res.data.success) {
        handleSuccess(res.data.message);
        localStorage.removeItem("isAuthenticated", isAuthenticated);
        localStorage.removeItem("loggedInUser", res.data.fullName);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      console.log("logged out error", error.message);
      handleError(error.message);
    }
  };
  // console.log(user);

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex items-center justify-between p-3 mx-auto relative">
        <div>
          <img
            src="https://www.shutterstock.com/image-vector/finance-control-hand-drawn-composition-260nw-2382150379.jpg"
            alt=""
            className="w-16 bg-white object-cover rounded-lg"
          />
        </div>

        <div className="">
          <button
            ref={burgerRef}
            className="flex flex-col space-y-1 md:hidden focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            onClick={handleToggle}
          >
            <div className="w-8 h-1 bg-white rounded-full"></div>
            <div className="w-8 h-1 bg-white rounded-full"></div>
            <div className="w-8 h-1 bg-white rounded-full"></div>
          </button>
          <ul
            ref={menuRef}
            className={`max-md:overflow-hidden max-md:h-screen  invisible transition-all duration-500 ease-in-out
    absolute w-[300px] top-22 right-0 bg-blue-600 text-white 
    rounded-l-lg rounded-b-lg flex flex-col items-center gap-3 z-10 
    ${
      isMenuOpen
        ? "max-h-screen visible pointer-events-auto"
        : "max-h-0 invisible pointer-events-none"
    }
    md:flex  md:static md:max-h-full md:visible md:pointer-events-auto md:transform-none md:flex-row md:bg-transparent md:gap-6 md:text-white md:p-0 md:w-auto`}
          >
            <li className="w-full text-center md:w-auto cursor-pointer p-3">
              <Link to={"/"}>Home</Link>
            </li>
            {!isAuthenticated ? (
              <>
                <li className="w-full text-center md:w-auto  cursor-pointer p-3">
                  <Link to={"/login"}>Login</Link>
                </li>
                <li className="w-full text-center md:w-auto cursor-pointer p-3">
                  <Link to={"/signup"}>SignUp</Link>
                </li>
              </>
            ) : (
              <>
                {" "}
                <li className="w-full text-center md:w-auto cursor-pointer p-3">
                  <Link to={"/transactions"}>Transactions</Link>
                </li>
                <li
                  ref={dropDownRef}
                  onClick={() => setDropDown(!dropDown)}
                  className="w-full text-center md:w-auto relative group z-50"
                >
                  <button className="btn text-white"><CircleUser />{user.fullName}</button>
                  <div
                    className={`absolute mt-1 md:right-0 right-16 w-50 bg-white shadow-lg rounded-box 
                     text-black transition ease-in-out duration-300  origin-top-right  
                    ${
                      dropDown
                        ? "opacity-100 scale-100 pointer-events-auto"
                        : "opacity-0 scale-95 pointer-events-none"
                    }
                    
             `}
                  >
                    {/* <div className="absolute w-4 h-4 rotate-45 bg-white -top-1 right-50  "></div> */}
                    <div
                      className="absolute -top-2 right-15 border-b-white 
                    border-b-[10px]
                    border-l-transparent border-l-[10px] border-r-transparent border-r-[10px] z-10"
                    ></div>
                    <ul
                      ref={dropDownRef1}
                      className=" bg-white cursor-pointer rounded-box"
                    >
                      <li className="cursor-pointer p-4 flex justify-start gap-3 items-center">
                      <CircleUser />
                        My Profile</li>
                      <li
                        className="cursor-pointer p-4 flex justify-start gap-3 items-center"
                        onClick={handleLogout}
                      >
                       <LogOut />
                        <button className="cursor-pointer ">Logout</button>
                      </li>
                    </ul>
                  </div>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
