import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { IoIosHeart } from "react-icons/io";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  // ensure that the new page starts at the top when navigating
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <section className="relative bg-yellow-400/5">
        <div className="">
          <div className="grid grid-cols-1">
            <div className="flex flex-col min-h-screen justify-center md:px-10 py-10 px-4">
              <div className="text-center">
                <Link to={"/"}>
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmWru8q17zpOzzzT1s475ZS_8fOL1GS0teSw&s"
                    className="mx-auto w-64"
                    alt=""
                  />
                </Link>
              </div>
              <div className=" text-center my-auto ">
                <img
                  src="https://i.ibb.co/SxMVZWM/error.png"
                  className="mx-auto"
                  alt=""
                />
                <h1 className="mt-3 mb-6 md:text-4xl text-3xl font-bold ">
                  {error?.data}
                </h1>
                <p className="my-10 text-red-500 text-xl">
                  {" "}
                  Error {error.status}:
                  <i className="text-red-500 text-xl ml-3">
                    {error.statusText || error.message}
                  </i>
                </p>
                <p className="text-slate-400">
                  Whoops, this is embarassing. <br />
                  Looks like the page you were looking for was not found.
                </p>

                <div className="mt-4">
                  <div className="flex items-center justify-center mt-6 gap-x-3">
                    <button
                      onClick={() => navigate(-1)}
                      className="btn w-32 bg-orange-400 hover:bg-orange-500 border-orange-400 hover:border-orange-500 text-slate-900 rounded-md">
                      Go Back
                    </button>

                    <Link
                      to={"/"}
                      className="btn w-32 bg-orange-400 hover:bg-orange-500 border-orange-400 hover:border-orange-500 text-slate-900 rounded-md">
                      Back to Home
                    </Link>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="mb-0 text-slate-400">
                  {new Date().getFullYear()}@ Meal Master. Design with{" "}
                  <IoIosHeart className="inline-block text-red-500" size={20} />{" "}
                  by{" "}
                  <Link
                    to={"https://github.com/JuborajSujon"}
                    target="_blank"
                    className="text-reset underline">
                    JuborajSujon
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ErrorPage;
