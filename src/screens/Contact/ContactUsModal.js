import axios from "axios";
import { Link } from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../../components/button/Button";
import { alertToast } from "../../utils/alert";
import { apiUrl } from "../../utils/constants";
import { XIcon } from "../../utils/icons";
import { images } from "../../utils/imagesConstant";
import "../Contact/Contact.css";
import Image from "next/image";
import { useTranslations } from "next-intl";
const ContactUsModal = ({ setPageModal }) => {
  const t = useTranslations("contact_us");
  const isMobile = useSelector((state) => state.setMobile);
  const [showSubmitMessage, setShowSubmitMessage] = useState(false);

  function submittedData(e) {
    e.preventDefault();
    if (!data.email || !data.message || !data.name || !data.subject) {
      alertToast({ message: t("fill_in_all_fields") });
    } else {
      submit();
    }
  }

  const [data, setData] = useState({
    email: "",
    name: "",
    message: "",
    subject: "",
  });

  function submit() {
    let body = {
      email: data.email,
      name: data.name,
      message: data.message,
      subject: data.subject,
    };
    axios.put(`${apiUrl.FEEDBACK}`, body).then(() => {
      setShowSubmitMessage(true);
    });
  }
  function handle(e) {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
  }
  return (
    <div className="full-screen-modal scrollable-modal">
      <nav className="navbar navbar-expand-lg container-fluid p-0 d-flex justify-content-between">
        <div className="swifty-gaming">
          {isMobile ? (
            <Image src={images.gamingMobile} alt="logo" />
          ) : (
            <Image src={images.GroupSwifty} alt="logo" />
          )}
        </div>
        <div
          className="close-full-modal-container"
          onClick={() => setPageModal("")}
        >
          <XIcon />
        </div>
      </nav>
      <div className="aboutUsPage">
        <div>
          {
            <>
              <div className="contact contactPage">
                <div className="container">
                  <div className="row contact mt-2">
                    <div className="col-md-6 span-sm-0" id="contact-banner">
                      <h2 className="banner-title-contact">
                        {t("contact_us")}
                      </h2>
                      <span className="banner-text-contact">
                        {t("need_help_or_support")}
                        <br /> <br />
                        {t("fill_out_form_or_contact_channels")}
                      </span>
                    </div>
                    <div className="col-md-6"></div>
                    <div
                      className="col-md-7 col-sm-8 col-lg-8 contact-form span-sm-0"
                      id="contact-form"
                    >
                      <div>
                        <div className="btn-group-vertical">
                          {showSubmitMessage ? (
                            <>
                              <Image
                                src={images.checkIcon}
                                alt="Submitted Icon"
                                className="submit-icon"
                              />
                              <span className="submit-message">
                                {t("thank_you_message_swifty_team")}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="contact-title mb-4">
                                {t("drop_us_a_line")}
                              </span>
                              <form
                                onSubmit={(e) => submittedData(e)}
                                id="formInputs"
                              >
                                <div>
                                  <input
                                    onChange={(e) => handle(e)}
                                    id="name"
                                    value={data.name}
                                    type="text"
                                    className="contact-buttons"
                                    placeholder={t("full_name")}
                                  />
                                </div>
                                <div>
                                  <input
                                    onChange={(e) => handle(e)}
                                    id="email"
                                    value={data.email}
                                    type="email"
                                    className="contact-buttons"
                                    placeholder={t("email_address")}
                                  />
                                </div>
                                <div className="topic-button">
                                  <select
                                    onChange={(e) => handle(e)}
                                    id="subject"
                                    value={data.subject}
                                    name="topics"
                                    className="contact-buttons select"
                                    placeholder={t("select_link_topic")}
                                  >
                                    <option value>{t("topic")}</option>
                                    <option value="Topic 1">
                                      {t("general_feedback")}
                                    </option>
                                    <option value="Topic 2">
                                      {t("bug_or_issue")}
                                    </option>
                                    <option value="Topic 3">
                                      {t("marketing_or_media")}
                                    </option>
                                    <option value="Topic 4">
                                      {t("complaint")}
                                    </option>
                                  </select>
                                </div>
                                <div>
                                  <textarea
                                    cols="40"
                                    rows="4"
                                    onChange={(e) => handle(e)}
                                    id="message"
                                    value={data.message}
                                    type="text"
                                    className="contact-buttons"
                                    placeholder={t("message")}
                                  />
                                </div>
                                <div className="submit-button-span">
                                  <Button
                                    type="submit"
                                    value="Submit"
                                    className={"btnPrimary submit-button"}
                                    onClick={submittedData}
                                    text={t("submit")}
                                  />
                                </div>
                              </form>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-md-5 col-sm-4 col-lg-4 social-form span-sm-0"
                      id="reach-us-form"
                    >
                      <span className="social-media-title">
                        {t("reach_us")}
                      </span>
                      <span className="social-divider" />
                      <div className="social-media-form">
                        <div className="social-media-accounts">
                          <Image
                            src={images.twitterIcon}
                            alt="Swifty Global Twitter Account"
                          />
                          <Link
                            to="https://twitter.com/SwiftyGlobal"
                            target="_blank"
                            rel="noreferrer"
                            className="contactUs-a"
                          >
                            <span className="accounts">@swifty.global</span>
                          </Link>
                        </div>
                        <div className="social-media-accounts">
                          <Image
                            src={images.instagramIcon}
                            alt="Swifty Global Instagram Account"
                          />
                          <Link
                            to="https://www.instagram.com/swiftyglobal/"
                            target="_blank"
                            rel="noreferrer"
                            className="contactUs-a"
                          >
                            <span className="accounts"> @swiftyglobal</span>
                          </Link>
                        </div>
                        <div className="social-media-accounts">
                          <Image
                            src={images.telegramIcon}
                            alt="Swifty Global Telegram"
                          />
                          <Link
                            to="https://t.me/swiftyglobal"
                            target="_blank"
                            rel="noreferrer"
                            className="contactUs-a"
                          >
                            <span className="accounts">/swiftyglobal</span>
                          </Link>
                        </div>
                        <div className="social-media-accounts">
                          <Image
                            src={images.linkedIcon}
                            alt="Swifty Global LinkedIn Account"
                          />
                          <Link
                            to="https://www.linkedin.com/company/swifty-global"
                            target="_blank"
                            rel="noreferrer"
                            className="contactUs-a-linkedin"
                          >
                            <span className="accounts">/swifty-global</span>
                          </Link>
                        </div>
                        <div className="social-media-accounts">
                          <Image
                            src={images.emailIcon}
                            alt="Swifty Global Email"
                          />
                          <Link
                            to="mailto:hello@swifty.global"
                            className="contactUs-a"
                          >
                            <span className="accounts">
                              hello@swifty.global
                            </span>
                          </Link>
                        </div>
                        <div className="social-media-accounts">
                          <Image
                            src={images.phoneIcon}
                            alt="Swifty Global Phone Number"
                          />
                          <a
                            href="tel:+442045424517 "
                            target="_blank"
                            rel="noreferrer"
                            className="contactUs-a-phone"
                          >
                            <p className="accounts">+44 (0) 204 542 4517 </p>
                          </a>
                        </div>
                        <div className="social-media-accounts">
                          <Image
                            src={images.locationIcon}
                            alt="Swifty Global Location"
                          />
                          <Link
                            to=""
                            target="_blank"
                            rel="noreferrer"
                            className="contactUs-a-location"
                          >
                            <p className="accounts">
                              Swifty Global NV
                              <br />
                              71-75, Shelton Street, Covent
                              <br />
                              Garden, London, WC2H 9JQ,
                              <br />
                              United Kingdom
                            </p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
};
export default ContactUsModal;
