import { FaGlobe, FaUsers, FaUser } from 'react-icons/fa'; // Icons from react-icons

const Navbar = () => {
    return (
        <nav className="bg-blue-500 sticky top-0 left-0 text-white px-2  py-1 shadow-lg">
            <div className="max-w-2xl mx-auto flex justify-between items-center">
                {/* Global */}
                <a
                    href="/"
                    className=" w-1/3 py-2 rounded-md mx-1 hover:bg-blue-800 transition"
                >
                    <div className='flex  flex-wrap  justify-center items-center space-x-2 '>

                        <FaGlobe className="text-xl" />
                        <span className="md:inline text-sm font-semibold">Global</span>

                    </div>
                </a>
                {/* Rooms */}
                <a
                    href="/rooms"
                    className=" w-1/3 py-2 rounded-md  hover:bg-blue-800 transition"
                >
                    <div className='flex  flex-wrap  justify-center items-center space-x-2  border-l-2 border-r-2 border-white'>

                        <FaUsers className="text-xl" />
                        <span className="md:inline text-sm font-semibold">Rooms</span>
                    </div>
                </a>



                {/* Profile */}
                <a
                    href="/profile"
                    className=" w-1/3 py-2 rounded-md mx-1 hover:bg-blue-800 transition"
                >
                    <div className='flex flex-wrap justify-center items-center space-x-2 '>

                        <FaUser className="text-xl" />
                        <span className="md:inline text-sm font-semibold">Profile</span>
                    </div>
                </a>

            </div>
        </nav>
    );
};

export default Navbar;