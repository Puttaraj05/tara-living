import os
from email.message import EmailMessage
from datetime import datetime

import aiosmtplib
from dotenv import load_dotenv

load_dotenv()


MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_FROM = os.getenv("MAIL_FROM")
MAIL_TO = os.getenv("MAIL_TO")


# =========================================================
# SEND OWNER NOTIFICATION
# =========================================================

async def send_contact_notification(
    name: str,
    email: str,
    phone: str,
    city: str,
    property_type: str,
    project_type: str,
    budget: str,
    message: str,
):
    submitted_at = datetime.now().strftime("%d %B %Y, %I:%M %p")

    mail = EmailMessage()

    mail["From"] = MAIL_FROM or MAIL_USERNAME
    mail["To"] = MAIL_TO
    mail["Reply-To"] = email
    mail["Subject"] = f"New Inquiry · {name} · Tara Living"

    # =====================================================
    # OWNER PLAIN TEXT VERSION
    # =====================================================

    plain_text = f"""
TARA LIVING

NEW WEBSITE INQUIRY

A new client has submitted an inquiry through the Tara Living website.

CLIENT DETAILS
--------------------------------

Name: {name}
Email: {email}
Phone: {phone}
City: {city}

PROJECT DETAILS
--------------------------------

Property Type: {property_type}
Project Type: {project_type}
Budget: {budget}

MESSAGE
--------------------------------

{message}

Submitted:
{submitted_at}

Tara Living
Interior Design & Living Spaces
"""

    # =====================================================
    # OWNER HTML VERSION
    # =====================================================

    html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Tara Living Inquiry</title>
</head>

<body style="
    margin:0;
    padding:0;
    background:#f3f1ec;
    font-family:Arial, Helvetica, sans-serif;
    color:#292823;
">

<table width="100%" cellpadding="0" cellspacing="0" border="0"
       style="background:#f3f1ec; padding:40px 15px;">

<tr>
<td align="center">

<table width="100%" cellpadding="0" cellspacing="0" border="0"
       style="
           max-width:680px;
           background:#ffffff;
           border:1px solid #dedbd3;
       ">

    <!-- HEADER -->

    <tr>
        <td style="
            padding:34px 40px;
            border-bottom:1px solid #e5e2db;
        ">

            <table width="100%" cellpadding="0" cellspacing="0" border="0">

                <tr>

                    <td>

                        <div style="
                            font-size:24px;
                            letter-spacing:5px;
                            font-weight:500;
                            color:#24231f;
                        ">
                            TARA
                        </div>

                        <div style="
                            font-size:10px;
                            letter-spacing:6px;
                            margin-top:3px;
                            color:#77736b;
                        ">
                            LIVING
                        </div>

                    </td>

                    <td align="right" valign="middle">

                        <div style="
                            font-size:10px;
                            letter-spacing:2px;
                            color:#8a867d;
                            text-transform:uppercase;
                        ">
                            Website Inquiry
                        </div>

                    </td>

                </tr>

            </table>

        </td>
    </tr>


    <!-- INTRO -->

    <tr>
        <td style="padding:42px 40px 25px;">

            <div style="
                font-size:11px;
                letter-spacing:2px;
                color:#8a867d;
                text-transform:uppercase;
                margin-bottom:12px;
            ">
                NEW CLIENT INQUIRY
            </div>

            <div style="
                font-size:30px;
                line-height:1.25;
                font-weight:400;
                color:#292823;
            ">
                A new project is waiting
                <br>
                for your attention.
            </div>

            <p style="
                margin:18px 0 0;
                font-size:14px;
                line-height:1.7;
                color:#77736b;
            ">
                Someone has submitted a project inquiry
                through the Tara Living website.
            </p>

        </td>
    </tr>


    <!-- CLIENT DETAILS -->

    <tr>
        <td style="padding:10px 40px 0;">

            <div style="
                font-size:11px;
                letter-spacing:2px;
                color:#8a867d;
                text-transform:uppercase;
                margin-bottom:14px;
            ">
                CLIENT DETAILS
            </div>

            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="
                       background:#f7f6f2;
                       border:1px solid #e5e2db;
                   ">

                <tr>

                    <td width="50%" style="
                        padding:20px;
                        border-right:1px solid #e5e2db;
                        border-bottom:1px solid #e5e2db;
                    ">

                        <div style="
                            font-size:10px;
                            color:#969188;
                            text-transform:uppercase;
                            letter-spacing:1px;
                            margin-bottom:7px;
                        ">
                            Name
                        </div>

                        <div style="
                            font-size:15px;
                            color:#292823;
                        ">
                            {name}
                        </div>

                    </td>

                    <td width="50%" style="
                        padding:20px;
                        border-bottom:1px solid #e5e2db;
                    ">

                        <div style="
                            font-size:10px;
                            color:#969188;
                            text-transform:uppercase;
                            letter-spacing:1px;
                            margin-bottom:7px;
                        ">
                            Email
                        </div>

                        <div style="
                            font-size:14px;
                            color:#292823;
                            word-break:break-word;
                        ">
                            {email}
                        </div>

                    </td>

                </tr>

                <tr>

                    <td width="50%" style="
                        padding:20px;
                        border-right:1px solid #e5e2db;
                    ">

                        <div style="
                            font-size:10px;
                            color:#969188;
                            text-transform:uppercase;
                            letter-spacing:1px;
                            margin-bottom:7px;
                        ">
                            Phone
                        </div>

                        <div style="
                            font-size:15px;
                            color:#292823;
                        ">
                            {phone}
                        </div>

                    </td>

                    <td width="50%" style="padding:20px;">

                        <div style="
                            font-size:10px;
                            color:#969188;
                            text-transform:uppercase;
                            letter-spacing:1px;
                            margin-bottom:7px;
                        ">
                            City
                        </div>

                        <div style="
                            font-size:15px;
                            color:#292823;
                        ">
                            {city}
                        </div>

                    </td>

                </tr>

            </table>

        </td>
    </tr>


    <!-- PROJECT DETAILS -->

    <tr>
        <td style="padding:32px 40px 0;">

            <div style="
                font-size:11px;
                letter-spacing:2px;
                color:#8a867d;
                text-transform:uppercase;
                margin-bottom:14px;
            ">
                PROJECT DETAILS
            </div>

            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="
                       border-top:1px solid #e5e2db;
                       border-bottom:1px solid #e5e2db;
                   ">

                <tr>

                    <td style="
                        padding:18px 5px;
                        color:#8a867d;
                        font-size:12px;
                        border-bottom:1px solid #eeeae3;
                    ">
                        Property Type
                    </td>

                    <td align="right" style="
                        padding:18px 5px;
                        color:#292823;
                        font-size:14px;
                        border-bottom:1px solid #eeeae3;
                    ">
                        {property_type}
                    </td>

                </tr>

                <tr>

                    <td style="
                        padding:18px 5px;
                        color:#8a867d;
                        font-size:12px;
                        border-bottom:1px solid #eeeae3;
                    ">
                        Project Type
                    </td>

                    <td align="right" style="
                        padding:18px 5px;
                        color:#292823;
                        font-size:14px;
                        border-bottom:1px solid #eeeae3;
                    ">
                        {project_type}
                    </td>

                </tr>

                <tr>

                    <td style="
                        padding:18px 5px;
                        color:#8a867d;
                        font-size:12px;
                    ">
                        Budget
                    </td>

                    <td align="right" style="
                        padding:18px 5px;
                        color:#292823;
                        font-size:14px;
                    ">
                        {budget}
                    </td>

                </tr>

            </table>

        </td>
    </tr>


    <!-- MESSAGE -->

    <tr>
        <td style="padding:32px 40px 0;">

            <div style="
                font-size:11px;
                letter-spacing:2px;
                color:#8a867d;
                text-transform:uppercase;
                margin-bottom:14px;
            ">
                CLIENT MESSAGE
            </div>

            <div style="
                padding:24px;
                background:#f7f6f2;
                border-left:3px solid #292823;
                font-size:14px;
                line-height:1.8;
                color:#4c4942;
            ">
                {message}
            </div>

        </td>
    </tr>


    <!-- ACTION -->

    <tr>
        <td align="center" style="padding:35px 40px 15px;">

            <a href="mailto:{email}"
               style="
                   display:inline-block;
                   padding:15px 30px;
                   background:#292823;
                   color:#ffffff;
                   text-decoration:none;
                   font-size:11px;
                   letter-spacing:1.5px;
                   text-transform:uppercase;
               ">
                Reply to {name}
            </a>

        </td>
    </tr>


    <!-- DATE -->

    <tr>
        <td align="center" style="padding:15px 40px 35px;">

            <div style="
                font-size:11px;
                color:#99958c;
            ">
                Submitted on {submitted_at}
            </div>

        </td>
    </tr>


    <!-- FOOTER -->

    <tr>
        <td style="
            padding:25px 40px;
            background:#292823;
        ">

            <div style="
                font-size:16px;
                letter-spacing:4px;
                color:#ffffff;
                text-align:center;
            ">
                TARA
            </div>

            <div style="
                font-size:9px;
                letter-spacing:4px;
                color:#aaa69d;
                text-align:center;
                margin-top:5px;
            ">
                LIVING
            </div>

            <div style="
                text-align:center;
                font-size:10px;
                color:#99958c;
                margin-top:15px;
            ">
                Interior Design &amp; Living Spaces
            </div>

        </td>
    </tr>

</table>

</td>
</tr>

</table>

</body>
</html>
"""

    mail.set_content(plain_text)
    mail.add_alternative(html_content, subtype="html")

    await aiosmtplib.send(
        mail,
        hostname="smtp.gmail.com",
        port=587,
        start_tls=True,
        username=MAIL_USERNAME,
        password=MAIL_PASSWORD,
    )


# =========================================================
# SEND AUTOMATIC CLIENT CONFIRMATION
# =========================================================

async def send_client_confirmation(
    name: str,
    email: str,
    property_type: str,
    project_type: str,
    city: str,
):
    mail = EmailMessage()

    mail["From"] = MAIL_FROM or MAIL_USERNAME
    mail["To"] = email
    mail["Subject"] = "Thank you for contacting Tara Living"

    # =====================================================
    # CLIENT PLAIN TEXT VERSION
    # =====================================================

    plain_text = f"""
TARA LIVING

Thank you for reaching out.

Hi {name},

Thank you for your interest in Tara Living.

We've received your project inquiry and our team will
review the details you've shared. Someone from our
team will get in touch with you shortly.

YOUR INQUIRY
--------------------------------

Project Type: {project_type}
Property Type: {property_type}
City: {city}

We look forward to helping you create a space
that feels distinctly yours.

TARA LIVING
Interior Design & Living Spaces
"""

    # =====================================================
    # CLIENT HTML VERSION
    # =====================================================

    html_content = f"""
<!DOCTYPE html>
<html>
<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>Thank You · Tara Living</title>

</head>

<body style="
    margin:0;
    padding:0;
    background:#f3f1ec;
    font-family:Arial, Helvetica, sans-serif;
    color:#292823;
">

<table width="100%"
       cellpadding="0"
       cellspacing="0"
       border="0"
       style="
           background:#f3f1ec;
           padding:40px 15px;
       ">

<tr>
<td align="center">

<table width="100%"
       cellpadding="0"
       cellspacing="0"
       border="0"
       style="
           max-width:640px;
           background:#ffffff;
           border:1px solid #dedbd3;
       ">

    <!-- HEADER -->

    <tr>

        <td align="center"
            style="
                padding:42px 30px;
                border-bottom:1px solid #e5e2db;
            ">

            <div style="
                font-size:26px;
                letter-spacing:6px;
                color:#24231f;
            ">
                TARA
            </div>

            <div style="
                font-size:10px;
                letter-spacing:6px;
                margin-top:4px;
                color:#77736b;
            ">
                LIVING
            </div>

        </td>

    </tr>


    <!-- MAIN -->

    <tr>

        <td align="center"
            style="
                padding:55px 45px 20px;
            ">

            <div style="
                font-size:11px;
                letter-spacing:2px;
                color:#8a867d;
                text-transform:uppercase;
                margin-bottom:18px;
            ">
                THANK YOU
            </div>

            <div style="
                font-size:34px;
                line-height:1.25;
                font-weight:400;
                color:#292823;
            ">
                We've received<br>
                your inquiry.
            </div>

            <p style="
                margin:22px auto 0;
                max-width:470px;
                font-size:15px;
                line-height:1.8;
                color:#77736b;
            ">
                Hi {name},
                <br><br>
                Thank you for reaching out to Tara Living.
                We've received your project details and
                our team will review your inquiry.
            </p>

        </td>

    </tr>


    <!-- INQUIRY CARD -->

    <tr>

        <td style="
            padding:20px 45px 0;
        ">

            <div style="
                font-size:11px;
                letter-spacing:2px;
                color:#8a867d;
                text-transform:uppercase;
                margin-bottom:14px;
            ">
                YOUR INQUIRY
            </div>

            <table width="100%"
                   cellpadding="0"
                   cellspacing="0"
                   border="0"
                   style="
                       background:#f7f6f2;
                       border:1px solid #e5e2db;
                   ">

                <tr>

                    <td style="
                        padding:20px;
                        color:#8a867d;
                        font-size:12px;
                        border-bottom:1px solid #e5e2db;
                    ">
                        Project Type
                    </td>

                    <td align="right"
                        style="
                            padding:20px;
                            color:#292823;
                            font-size:14px;
                            border-bottom:1px solid #e5e2db;
                        ">
                        {project_type}
                    </td>

                </tr>

                <tr>

                    <td style="
                        padding:20px;
                        color:#8a867d;
                        font-size:12px;
                        border-bottom:1px solid #e5e2db;
                    ">
                        Property Type
                    </td>

                    <td align="right"
                        style="
                            padding:20px;
                            color:#292823;
                            font-size:14px;
                            border-bottom:1px solid #e5e2db;
                        ">
                        {property_type}
                    </td>

                </tr>

                <tr>

                    <td style="
                        padding:20px;
                        color:#8a867d;
                        font-size:12px;
                    ">
                        City
                    </td>

                    <td align="right"
                        style="
                            padding:20px;
                            color:#292823;
                            font-size:14px;
                        ">
                        {city}
                    </td>

                </tr>

            </table>

        </td>

    </tr>


    <!-- MESSAGE -->

    <tr>

        <td align="center"
            style="
                padding:35px 45px 10px;
            ">

            <p style="
                margin:0;
                max-width:470px;
                font-size:14px;
                line-height:1.8;
                color:#77736b;
            ">
                We appreciate you considering Tara Living
                for your project. A member of our team
                will get in touch with you shortly.
            </p>

        </td>

    </tr>


    <!-- CLOSING -->

    <tr>

        <td align="center"
            style="
                padding:25px 45px 50px;
            ">

            <div style="
                font-size:15px;
                color:#292823;
                font-style:italic;
            ">
                We look forward to creating<br>
                something beautiful with you.
            </div>

        </td>

    </tr>


    <!-- FOOTER -->

    <tr>

        <td style="
            padding:30px 30px;
            background:#292823;
        ">

            <div style="
                font-size:17px;
                letter-spacing:5px;
                color:#ffffff;
                text-align:center;
            ">
                TARA
            </div>

            <div style="
                font-size:9px;
                letter-spacing:5px;
                color:#aaa69d;
                text-align:center;
                margin-top:5px;
            ">
                LIVING
            </div>

            <div style="
                text-align:center;
                font-size:10px;
                color:#99958c;
                margin-top:15px;
            ">
                Interior Design &amp; Living Spaces
            </div>

        </td>

    </tr>

</table>

</td>
</tr>

</table>

</body>
</html>
"""

    mail.set_content(plain_text)
    mail.add_alternative(html_content, subtype="html")

    await aiosmtplib.send(
        mail,
        hostname="smtp.gmail.com",
        port=587,
        start_tls=True,
        username=MAIL_USERNAME,
        password=MAIL_PASSWORD,
    )