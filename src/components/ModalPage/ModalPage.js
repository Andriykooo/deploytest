"use client";

import { XIcon } from "@/icons/XIcon";
import { Logo } from "../logo/Logo";
import { useSelector } from "react-redux";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import { useClientPathname } from "@/hooks/useClientPathname";
import "./ModalPage.css";
import "../header/Header.css";

export const ModalPage = ({ children }) => {
  const { pathname } = useClientPathname();
  const router = useCustomRouter();
  const lastVisitedPage = useSelector((state) => state.lastVisitedPage);

  const closeModal = () => {
    router.push(lastVisitedPage !== pathname ? lastVisitedPage || "/" : "/");
  };

  return (
    <>
      <header>
        <nav className="navigation navbar-expand-lg p-0 d-flex justify-content-between align-items-center">
          <div className="swifty-gaming">
            <Logo />
          </div>
          <div className="close-full-modal-container" onClick={closeModal}>
            <XIcon />
          </div>
        </nav>
      </header>
      <div className="modal-page-content">{children}</div>
    </>
  );
};
