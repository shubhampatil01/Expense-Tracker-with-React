import { Fragment, useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import authContext from "./../Store/AuthContext";
import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const history = useHistory();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const authCtx = useContext(authContext);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    // For swicthing between create account and login with existing account
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value; //Takes the input from authentication form
    const enteredPassword = passwordInputRef.current.value; //Takes the input from authentication
    localStorage.setItem("email", enteredEmail);
    // optional: Add validation

    setIsLoading(true);
    let url;
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAZ58t-_MvVDQ3e_pDLaFu4YWhyu7Ix4Xc";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAZ58t-_MvVDQ3e_pDLaFu4YWhyu7Ix4Xc";
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true, // For logging we require these keys
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false);

        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Invalid Credentials";

            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        //Login token saved to context
        authCtx.login(data.idToken);
        // send the page to Homepage if successfully logged in
        history.replace("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  let content = isLogin ? "Login" : "Create Account";
  if (isLoading) {
    content = <p>Sending request.....</p>; //when the user clicks on login/create account then appears
  }

  return (
    <Fragment>
      <section className={classes.auth}>
        <h1>{isLogin ? "Login" : "Sign Up"}</h1>
        <form onSubmit={submitHandler}>
          <div className={classes.control}>
            <label htmlFor="email"> Email</label>
            <input type="email" id="email" required ref={emailInputRef} />
          </div>
          <div className={classes.control}>
            <label htmlFor="password"> Password</label>
            <input
              type="password"
              id="password"
              required
              ref={passwordInputRef}
            />
          </div>
          {!isLogin && (
            <div className={classes.control}>
              <label htmlFor="confirm password">Confirm Password</label>
              <input
                type="password"
                id="confirm password"
                required
                ref={passwordInputRef}
              />
            </div>
          )}
          <div className={classes.actions}>
            <button>{content}</button>
            <button
              type="button"
              className={classes.toggle}
              onClick={switchAuthModeHandler}
            >
              {isLogin ? "Create new account" : "Login with existing account"}
            </button>
          </div>
        </form>
      </section>
    </Fragment>
  );
};

export default AuthForm;
