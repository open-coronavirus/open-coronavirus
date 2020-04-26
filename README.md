<img src="https://github.com/open-coronavirus/open-coronavirus/blob/master/screenshots/logo-opencoronavirus.png?raw=true" width="600" />

> This document is also available in [spanish](./README.es.md)

# What is Open Coronavirus?
The availability of an effective vaccine may be delayed indefinitely for up to possibly 18 months. This requires quarantine measures - currently of a general nature - for the entire population. At the same time, health authorities are contemplating performing diagnostic tests at the population level, to ensure proper epidemiological control.

The **Open Coronavirus** project offers, for this time interval, a digital solution
for **monitoring, diagnosing and containing SARS-CoV-2 infection** that allows quarantine measures to be applied in a controlled manner at focal points or hotspots, thus minimizing the general quarantine of the population, reducing the overload of health systems, and at the same time facilitating the progressive resumption of daily activity in the shortest possible time.

The system will have 3 applications:
- **Citizen App**. Collaborative Mobile app to control spread of SARS-CoV-2.

    The application allows you to **request a test, and receive the ensuing results.** Will be made possible **by a personalised QR code to identify the user.**

    **Anonymous cross paths** of the user (with **Bluetooth Low Energy**) will be logged into his mobile to control possible infections and
to enable SARS-CoV-2 monitoring by health authorities.

   
- **Centralised Data Management Software (coming soon)** where health & epidemiologic control authorities will track the spread of SARS-CoV-2.

- **Authorities App.** Mobile app enabling authorities to read the users' QR codes
where needed, as well as tracking the users' mobility.




> **Important** A team of medical and bioethical research experts from Oxford University explains the need for such an application:
http://www.ox.ac.uk/news/2020-03-17-infectious-disease-experts-provide-evidence-coronavirus-mobile-app-instant-contact


> Should the Ministry of Health, or the regional health authorities decide to take on the dissemination of the app and the processing of its data, **the use of the app would be in line with General Data Protection Regulation (GPDR).**


For more information, you can consult [WikiProject](https://github.com/open-coronavirus/open-coronavirus/wiki):
* [01. Process functionality description](https://github.com/open-coronavirus/open-coronavirus/wiki/01.-Process-functionality-description)
  * [01.01. SARS CoV 2 diagnostic test](https://github.com/open-coronavirus/open-coronavirus/wiki/01.01.-SARS-CoV-2-diagnostic-test)
  * [01.02. Diagnostic test results](https://github.com/open-coronavirus/open-coronavirus/wiki/01.02.-Diagnostic-test-results)
  * [01.03. SARS CoV 2 control](https://github.com/open-coronavirus/open-coronavirus/wiki/01.03.-SARS-CoV-2-control)
  * [01.04. Quarantine control](https://github.com/open-coronavirus/open-coronavirus/wiki/01.04.-Quarantine-control)
* [02. Legal Considerations](https://github.com/open-coronavirus/open-coronavirus/wiki/02.-Legal-Considerations)
* [03. Citizen's App](https://github.com/open-coronavirus/open-coronavirus/wiki/03.-Citizen's-App)
* [04. Centralised Data Management Software](https://github.com/open-coronavirus/open-coronavirus/wiki/04.-Centralised-Data-Management-Software)
* [05. Authorities App](https://github.com/open-coronavirus/open-coronavirus/wiki/05.--Authorities-App)
* [06. Languages](https://github.com/open-coronavirus/open-coronavirus/wiki/06.-Languages)



## Why did we create Open Coronavirus?
**We do not intend to publish this APP**, since it must be the relevant Ministry or body that does so. We know [that the government is investing in an application like this one](https://elpais.com/tecnologia/2020-03-16/el-gobierno-impulsa-una-aplicacion-inspirada-en-el-exito-de-corea-del-sur-para-combatir-el-coronavirus.html) however since speed is key, we are making this code available to the relevant bodies in the event it may be of use.
Given the urgency of the current situation, no amount of help is enough. That is why we have designed and programmed the basic core of a project with 100% functional apps that can respond to some citizens’ needs during the quarantine period.
The design is flexible enough to add or change functionalities in an easy and fast way, which is what we need now.
This application aims to help citizens and fight the pandemic.
Be responsible. Together, we will defeat the virus!
\#iamstayinghome

## How is the app follow the spread of the virus based on the Bluetooth Low Energy?

The app uses **Bluetooth Low Energy** technology which is able to track possible COVID-19 exposure. Every citizen has the application installed and with bluetooth connected. 

This is how the **Bluetooth LE** system works:

1. When **two citizens are physically close** their phones will exchange **anonymous identification codes** through Bluetooth LE. Each of these encounters will be stored in the phone's memory.

    The proximity of the the two phones is measured based on the intensity of the bluetooth signal. It will also store the amount of time that you were with the individual who is COVID-19 positive to know your level of exposure to the virus.

    **This information will only be stored for a limited period of time** as a protection to citizens' privacy.
    You can figure the amount of time using the tool but **it is recommended to be set to between 14 and 37 days** which is the amount of time in which a diagnosed carrier would have been able to infect others with COVID-19.

2. **In the case that a citizen is tested positive for COVID-19**, the application would update your QR status to red and perform the analysis to determine which people you could have been in close proximity to.

    The system **will upload to a server all potentially contagious encounters** and would send a push notification to those individuals so that they would be aware of the potential risk and/or to encourage them to have a diagnostic test.

> It is fundamentally important that the official health system of the administration or government be properly integrated with the application.

| ![Bluetooth LE flow](https://raw.githubusercontent.com/open-coronavirus/open-coronavirus/master/screenshots/bluetooth-description-1-2-en.png) | 
|:--:|
| *Follow the spread of the virus based on the Bluetooth Low Energy* |



---

This past **10th of April 2020, Apple and Google** made an [official agreement](insert link here) to implement a native level contract tracing technology on their operating system using Bluetooth Low Energy technology.

Conceptually it is a similar strategy to what is used in _Open Coronavirus_.

> As soon as API SDK is functioning we will work to connect our bluetooth system to the native system to have more inclusive and optimal results. 

## Legal considerations
**The project has not been published.** Before publishing, one of the things that must be done is its adaptation to the legislation on the processing of personal data.
**The project is available to any Ministry of Health, state administration or competent autonomous administration** for implementation. They will be responsible for the dissemination of the app and processing of the data obtained, following the GDPR Law.
The data collected must be managed following the law regarding security measures for its storage, maximum term of custody and storage, and information on user rights (especially information concerning purpose and revocation of consent).
Likewise, although this app asks the user for their consent, the GDPR Law also contains exceptions to the need for prior consent for the treatment of data, in the event of an epidemic or for the protection of people's health based on general interest, which is our current situation. The scenario in which this report focuses is one in which the autonomous health authorities adopt extraordinary measures for the protection of public health, since it is the only body authorized to adopt this type of measure.
> **According to the Spanish Data Protection Authority (APED)** To comply with decisions about the coronavirus pandemic that are adopted by the competent authorities, particularly health authorities, data protection regulations should not be used to hinder or limit the effectiveness of the measures that these authorities adopt in the fight against the pandemic.
> Data protection regulations allow the adoption of measures necessary to safeguard the vital interests of individuals, essential public interest in the healthcare field, the performance of medical diagnostics, or compliance with legal obligations in the work sphere, including the treatment of health data without the need for the explicit consent of the affected party.
> In any case, the processing of this data must observe the principles established in the GDPR, in particular those of minimization, limitation of purpose and minimization of data retention.

## Risk mitigation strategy to maximize both data privacy and data utility
Open-coronavirus is being designed according to the following principles:
- **Compliance with user privacy rigths:** We believe no one should be obligated to share their personal information. On the one hand, non-carriers (i.e. those tested negative) are not required to share any personal information with a third party. On the other hand, diagnosed carriers would be prompted to share information, only with prior user-consent and on a decentralized, encripted and temporary way so to help implement the geospatial risk trace module including user alerts, which are necessary to maintain an effective surveillance.
- **Time limited storage of location trails further protects the privacy of diagnosed carriers.** On this regard, first only anonymized, redacted, and aggregated sensitive information should be stored. Also, the appropriate amount of time for data storage should equal and not exceed the time during which a diagnosed carrier could have possibly infected another individual which for Covid-19 is between 14 to 37 days.
- **Use of a distributed network**, rather than a central server
- **Use of an open-source approach** to create an app to fosters trust in the app’s privacy protection capabilities, as independent experts and media can access and evaluate the source code.

The principles outlined above, while being technically compatible with current data privacy regulations are inspired in **Apps Gone Rogue**: <a href="https://arxiv.org/pdf/2003.08567.pdf" target="_blank">Maintaining Personal Privacy in an Epidemic</a>




## Project Structure

The project is built on top of an horizontal architecture of node servers running on dockers and being balanced against a mongoDB database. The design allow to replace the database by whatever data stores since repositories (classes in charge of comunicating with the data store) are decoupled from the rest of the code. The framework used is Loopback 4, which allow to define models, controllers, repositories and datasources completely decoupled.

Apart from that, we know that this application should be integrated with health department databases, so we have define some services as interfaces allowing easily to integrate it with real databases by just implementing those interfaces.

The project is organized as follows:
- `server` - NODE server (Loopback)
- `app-citizen` - Code of the CitizenApp (Ionic)
- `dashboard` - Code of the web dashboard where the data analysis will be performed (Angular) _(coming soon)_ 
- `app-police` - Code of the Authorities’ App (Ionic)
The app compiles for both Android and iOS.
### Server
To run the server, you need a mongoDB database and must adjust the .env.dev or .env.production settings accordingly.
You will also need to download all dependencies using
```
cd server
npm install
```
Finally, to run the server use
```
npm start
```
### Citizen App
The App is made with the ionic framework. You will need to install the client using
```
npm install -g @ionic/cli
```
You will also need to download all dependencies using
```
cd app
npm install
```
Then, to run it use (use configuration parameter to force english version)
```
ionic serve --configuration=en
```
This allows you to run the app in a browser. 

In order to test your application in a real device like an iphone or an android phone, execute the following command:

```
ionic capacitor run ios --livereload --external --host=<server-ip>
```

Just determine the network ip of the host where ionic is running the http server and replace in the --host parameter.


## Citizen App displays (main element of the project)
| | | |  
|:--:|:--:| :--:|  
| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen1-es-3.jpg" alt="Pantalla 1" width="250"/> | <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen2-es-3.jpg" alt="Pantalla 2" width="250"/>| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen3-es-3.jpg" alt="Pantalla 3" width="250"/>
| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen4-es-3.jpg" alt="Pantalla 4" width="250"/> | <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen5-es-3.jpg" alt="Pantalla 5" width="250"/>| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen6-es-3.jpg" alt="Pantalla 6" width="250"/>
| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen7-es-3.jpg" alt="Pantalla 7" width="250"/> | <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen8-es-3.jpg" alt="Pantalla 8" width="250"/>| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen9-es-3.jpg" alt="Pantalla 9" width="250"/>
| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen10-es-3.jpg" alt="Pantalla 10" width="250"/> | <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen11-es-3.jpg" alt="Pantalla 11" width="250"/>| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen12-es-3.jpg" alt="Pantalla 12" width="250"/>
| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen13-es-3.jpg" alt="Pantalla 13" width="250"/> | <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen14-es-3.jpg" alt="Pantalla 14" width="250"/>| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen15-es-3.jpg" alt="Pantalla 15" width="250"/>
| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen16-es-3.jpg" alt="Pantalla 16" width="250"/> | <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen17-es-3.jpg" alt="Pantalla 17" width="250"/>| <img src="https://raw.githubusercontent.com/open-coronavirus/open-coronavirus/master/screenshots/screen18-es-3.jpg" alt="Pantalla 18" width="250"/>
| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen19-es-3.jpg" alt="Pantalla 19" width="250"/> | <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen20-es-3.jpg" alt="Pantalla 20" width="250"/>| <img src="https://raw.githubusercontent.com/open-coronavirus/open-coronavirus/master/screenshots/screen21-es-3.jpg" alt="Pantalla 21" width="250"/>
| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen22-es-3.jpg" alt="Pantalla 22" width="250"/> ||
## More info

- Conference: **Open Coronavirus. Digital Solution for monitoring, diagnosing and containing SARS-COV-2 infection** by Aurelia Bustos in a 1º Anban Congress, IA and Big Data against COVID-19
    https://www.youtube.com/watch?v=qLDpcljJRyM&feature=youtu.b
    
- Official slides: https://raw.githubusercontent.com/open-coronavirus/open-coronavirus/master/info/Open-Coronavirus-en.pdf


## License
[MIT License](license.md)

## Special thanks

> Special thanks to **Trayma Traducciones** for the english translations

> Special thanks to **Alex Nogues** for translate to english the wiki

> Special thanks to **Marc Mauri** for translate to catalan the app

> Special thanks to **Yaiza Berenguer** for translate to french the app

> Special thanks to **Laura Gea** for translate to italian the app

> Special thanks to **Ma. Amparo Aymerich** for translate to german the app

## How you can help
PRs welcome.

Slack workspace: [slack://opencoronavirus.slack.com](slack://opencoronavirus.slack.com)
