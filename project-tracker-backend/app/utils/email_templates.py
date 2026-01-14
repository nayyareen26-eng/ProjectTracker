def password_set_email(first_name: str, reset_link: str):
    return f"""
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h3>Hello {first_name},</h3>

        <p>
          You have been invited to <b>Project Tracker</b>.
        </p>

        <p>
          Click the button below to set your password:
        </p>

        <a href="{reset_link}"
           style="
             display: inline-block;
             padding: 10px 16px;
             background-color: #4F46E5;
             color: white;
             text-decoration: none;
             border-radius: 6px;
             margin-top: 10px;
           ">
          Set Password
        </a>

        <p style="margin-top: 20px;">
          This link will expire in <b>15 minutes</b>.
        </p>

        <p>
          Regards,<br>
          <b>Project Tracker Team</b>
        </p>
      </body>
    </html>
    """
