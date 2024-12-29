const SetupOTP = ({ secret, qr_image, verifyOTP }) => {
  return (
    <main>
      <form>
        <h5>Instructions!</h5>
        <ul>
          <li>
            Download{" "}
            <a
              href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US"
              target="_blank"
            >
              Google Authenticator
            </a>{" "}
            on your mobile.
          </li>
          <li>Set up a new authenticator.</li>
          <li>
            Once you have scanned the QR, please click{" "}
            <a onClick={verifyOTP}>here</a>.
          </li>
        </ul>
        <div>
          <img src={`data:image/png;base64, ${qr_image}`} alt="Secret Token" />
        </div>
        <div>
          <label htmlFor="secret">Secret Token</label>
          <input type="text" id="secret" value={secret} readOnly />
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(secret);
            }}
          >
            Copy Secret
          </button>
        </div>
      </form>
    </main>
  );
};

export default SetupOTP;
