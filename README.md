# BioSync ⏱️

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.x-brightgreen)](https://nodejs.org)
[![Playwright](https://img.shields.io/badge/playwright-1.40+-blue)](https://playwright.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

**BioSync** is a production-ready automation service that extracts fingerprint-based attendance reports from **BioTime 8.0** systems. Built with Node.js, Express, and Playwright, it provides a REST API to trigger, monitor, and download attendance data seamlessly.

```mermaid
graph LR
    A[Your App] -->|API Request| B[BioSync Service]
    B -->|Automates| C[BioTime 8.0]
    C -->|Excel Report| B
    B -->|Download/Buffer| A
