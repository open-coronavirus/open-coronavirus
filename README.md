<img src="https://github.com/open-coronavirus/open-coronavirus/blob/master/screenshots/logo-opencoronavirus.png?raw=true" width="600" />

> This document is also available in [spanish](./README.es.md)

# What is Open Coronavirus?
The availability of an effective vaccine may be delayed indefinitely for up to possibly 18 months. This requires quarantine measures - currently of a general nature - for the entire population. At the same time, health authorities are contemplating performing diagnostic tests at the population level, to ensure proper epidemiological control.

The **Open Coronavirus** project offers, for this time interval, a digital solution
for **monitoring, diagnosing and containing SARS-CoV-2 infection** that allows quarantine measures to be applied in a controlled manner at focal points or hotspots, thus minimizing the general quarantine of the population, reducing the overload of health systems, and at the same time facilitating the progressive resumption of daily activity in the shortest possible time.

The system will have 3 applications:
- **Citizen App**. Mobile application for citizen collaboration and to control the spread of SARS-CoV-2.
    From the application **a diagnostic test will be requested, and the results of the test can be seen.**
All citizen movements will be stored to control possible infection and to delimit the scope of action of SARS-CoV-2 by the health authorities.
    It will serve as **QR-code based citizen identification.**
- **Data control software** where health and epidemiological control authorities will be able to consult and detect the movements of SARS-CoV-2.
    From the software, they will be able to see focal points of infection, compliance of mandatory quarantine for those infected or potentially infected.
- **Authorities’ App**. Mobile application that enables relevant authorities to read citizens’ QR identification codes in the locations where they have decided to monitor
their movements in this way.



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
## Citizen App displays (main element of the project)
| | | |  
|:--:|:--:| :--:|  
| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen1-es-2.jpg" alt="Pantalla 1" width="250"/> | <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen2-es-2.jpg" alt="Pantalla 2" width="250"/>| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen3-es-2.jpg" alt="Pantalla 3" width="250"/>
| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen4-es-2.jpg" alt="Pantalla 4" width="250"/> | <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen5-es-2.jpg" alt="Pantalla 5" width="250"/>| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen6-es-2.jpg" alt="Pantalla 6" width="250"/>
| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen7-es-2.jpg" alt="Pantalla 7" width="250"/> | <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen8-es-2.jpg" alt="Pantalla 8" width="250"/>| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen9-es-2.jpg" alt="Pantalla 9" width="250"/>
| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen10-es-2.jpg" alt="Pantalla 10" width="250"/> | <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen11-es-2.jpg" alt="Pantalla 11" width="250"/>| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen12-es-2.jpg" alt="Pantalla 12" width="250"/>
| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen13-es-2.jpg" alt="Pantalla 13" width="250"/> | <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen14-es-2.jpg" alt="Pantalla 14" width="250"/>| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen15-es-2.jpg" alt="Pantalla 15" width="250"/>
| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen16-es-2.jpg" alt="Pantalla 16" width="250"/> | <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen17-es-2.jpg" alt="Pantalla 17" width="250"/>| <img src="https://raw.githubusercontent.com/open-coronavirus/open-coronavirus/master/screenshots/screen18-es-2.jpg" alt="Pantalla 18" width="250"/>



## License
[MIT License](license.md)

## Special thanks

> Special thanks to **Trayma Traducciones** for the english translations

> Special thanks to **Alex Nogues** for translate to english the wiki

> Special thanks to **Marc Mauri** for translate to catalan the app

## How you can help
PRs welcome.

Slack workspace: [slack://opencoronavirus.slack.com](slack://opencoronavirus.slack.com)
