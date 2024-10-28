import React, { useState } from "react";
import "./navbar.css";
import { BiSearch } from "react-icons/bi";
import { BsInstagram, BsList } from "react-icons/bs";
import { CgAddR, CgClose } from "react-icons/cg";
import { FaRegHeart } from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { MdOutlineExplore } from "react-icons/md";
import { PiVideoBold } from "react-icons/pi";
import { RiMessengerLine, RiThreadsLine } from "react-icons/ri";

import More from "./more";
import Search from "./Search";
import Create from "../../pages/Create";
import { auth } from "../firebase";

export default function Navbar() {
  const [onMore, setOnMore] = useState(false);
  const [onSearch, setOnSearch] = useState(false);
  const [onCreate, setOnCreate] = useState(false);

  const img = auth.currentUser.photoURL;

  return (
    <>
      {/*navbar more*/}

      {onMore && (
        <div className=" fixed z-[80] bottom-[5rem] left-[30%] md:left-1">
          <More setOnMore={setOnMore} />
        </div>
      )}

      {/*search pop up*/}

      {onSearch && (
        <div className="fixed z-1 h-full md:left-[62px] lg:left-[226px] animatedSearchOut ">
          <Search setOnSearch={setOnSearch} />
        </div>
      )}

      {/*Create post*/}

      {onCreate && (
        <div className="fixed content-center w-full h-full bg-black/70 z-[60]">
          <CgClose
            className="absolute right-1 top-1 cursor-pointer text-gray-300"
            size={28}
            onClick={() => setOnCreate(false)}
          />
          <Create setOnCreate={setOnCreate} />
        </div>
      )}

      <div className=" shadow-sm border-b sticky w-full bg-white top-0 md:hidden lg:hidden z-50">
        {/*sm navbar Top*/}
        <div className="flex w-full h-[3.3rem] px-[8px] items-center justify-between border-b-gray-300 border-[1.5px] ">
          <div className="flex items-center gap-2">
            <a href="/">
              <img
                className="min-h-[15px] max-h-[42px]"
                src="https://links.papareact.com/ocw"
              />
            </a>

            <BsList
              className="cursor-pointer size-6 mr-1"
              onClick={() => setOnMore(true)}
            />
          </div>
          <div className="flex items-baseline">
            <div className="flex h-[2.3rem] items-center bg-gray-300/65 p-[15px] mr-[9px] rounded-lg">
              <BiSearch className="text-gray-500 mr-[3px]" size={20} />
              <input
                type="text"
                className="bg-transparent ml-2 focus:outline-none text-gray-500"
                placeholder="Search"
              />
            </div>
            <FaRegHeart className="mx-2 cursor-pointer" size={25} />
          </div>
        </div>

        {/*sm navbar Bottom*/}

        <div className="fixed w-full py-[6px] bg-white bottom-0 border-t-gray-300 border-[1.5px]">
          <div className="flex justify-evenly py-[5px] items-center">
            <a href="/">
              <div>
                <GoHomeFill size={23} className="hover:navbarIcon" />
              </div>
            </a>
            <div>
              <MdOutlineExplore size={23} className="hover:navbarIcon" />
            </div>

            <div>
              <PiVideoBold size={23} className="hover:navbarIcon" />
            </div>

            <div>
              <CgAddR
                onClick={() => setOnCreate(true)}
                size={23}
                className="hover:navbarIcon"
              />
            </div>

            <div>
              <RiMessengerLine size={23} className="hover:navbarIcon" />
            </div>
            <a href="/profile">
              <div>
                <img
                  src={img}
                  className="object-cover size-[25px] cursor-pointer rounded-full hover:scale-[1.2] border transition-all duration-150 ease-out"
                />
              </div>
            </a>
          </div>
        </div>
      </div>
      {/****md, lg sidebar*****/}

      <div className=" hidden fixed bg-white left-0 border-r-gray-300 border-[1.5px] h-full p-1 md:block lg:block z-50">
        <div className="flex flex-col justify-evenly p-3 pl-4 pr-2 h-full items-center ">
          <div className="h-[40px]">
            <div className="hidden md:block lg:hidden instaIcon">
              <a href="/">
                <BsInstagram size={25.5} />
              </a>
            </div>
            <div className="hidden lg:block">
              <a href="/">
                <img
                  className="h-[40px]"
                  src="https://links.papareact.com/ocw"
                />
              </a>
            </div>
          </div>

          <div className="h-1/2 relative flex flex-col justify-evenly lg:mt-[1.5rem] ">
            <div className=" lg-icon-box">
              <a href="/">
                <div className="lg-icons lg:lgNavbarIcon group">
                  <GoHomeFill
                    className="lg-mg-icon group-hover:md:navbarIcon"
                    size={25.9}
                  />

                  <span className="lg-span">Home</span>
                </div>
              </a>
            </div>

            <div className=" lg-icon-box">
              <div
                onClick={() => setOnSearch(!onSearch)}
                className="lg-icons lg:lgNavbarIcon  group"
              >
                <BiSearch
                  className="lg-mg-icon group-hover:md:navbarIcon"
                  size={25.5}
                />
                <span id="searchIcon" className="lg-span">
                  Search
                </span>
              </div>
            </div>

            <div className=" lg-icon-box">
              <div className="lg-icons lg:lgNavbarIcon  group">
                <MdOutlineExplore
                  className="lg-mg-icon group-hover:md:navbarIcon"
                  size={25.5}
                />
                <span className="lg-span">Explore</span>
              </div>
            </div>

            <div className=" lg-icon-box">
              <div className="lg-icons lg:lgNavbarIcon  group">
                <PiVideoBold
                  className="lg-mg-icon group-hover:md:navbarIcon"
                  size={25.5}
                />
                <span className="lg-span">Reel</span>
              </div>
            </div>

            <div className=" lg-icon-box">
              <div className="lg-icons lg:lgNavbarIcon group">
                <RiMessengerLine
                  className="lg-mg-icon group-hover:md:navbarIcon"
                  size={25.5}
                />
                <span className="lg-span">Messages</span>
              </div>
            </div>

            <div className=" lg-icon-box">
              <div className="lg-icons lg:lgNavbarIcon group">
                <FaRegHeart
                  className="lg-mg-icon group-hover:md:navbarIcon"
                  size={24.5}
                />
                <span className="lg-span">Notification</span>
              </div>
            </div>

            <div className=" lg-icon-box">
              <div
                onClick={() => setOnCreate(true)}
                className="lg-icons lg:lgNavbarIcon group"
              >
                <CgAddR
                  className="lg-mg-icon group-hover:md:navbarIcon"
                  size={25.5}
                />
                <span className="lg-span">Create</span>
              </div>
            </div>

            <div className=" lg-icon-box">
              <a href="/profile">
                <div className="lg-icons lg:lgNavbarIcon group">
                  <img
                    src={auth.currentUser.photoURL}
                    className="object-cover size-7 cursor-pointer rounded-full border group-hover:scale-[1.12] transition-all duration-150 ease-out "
                  />
                  <span className="lg-span">Profile</span>
                </div>
              </a>
            </div>
          </div>

          <div className=" h-1/6 flex flex-col justify-evenly gap-5 mt-[8.4rem]">
            <div className=" lg-icon-box">
              <div className="lg-icons lg:lgNavbarIcon group">
                <RiThreadsLine
                  className="lg-mg-icon group-hover:md:navbarIcon"
                  size={25.5}
                />
                <span className="lg-span">Tread</span>
              </div>
            </div>

            <div className=" lg-icon-box">
              <div
                onClick={() => setOnMore(!onMore)}
                className="lg-icons lg:lgNavbarIcon group"
              >
                <BsList
                  className="lg-mg-icon group-hover:md:navbarIcon"
                  size={25.5}
                />
                <span className="lg-span">More</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
