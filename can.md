# Technical Report: Design and Implementation of a CAN Bus Intrusion Detection System
## An In-Depth Analysis of Automotive Network Security

**Author:** [Your Name]  
**Date:** November 30, 2025  
**Document Version:** 2.0 (Expanded Edition)

---

## Table of Contents

1. Introduction and Background
2. The Controller Area Network Protocol: Deep Dive
3. Security Vulnerabilities in Automotive Networks
4. Advanced Attack Methodologies
5. System Design Philosophy and Architecture
6. Hardware Implementation and Engineering
7. Software Development and Implementation
8. Experimental Methodology and Testing
9. Results, Analysis, and Performance Evaluation
10. Conclusions and Future Research Directions
11. References and Appendices

---

## Chapter 1: Introduction and Background

### 1.1 The Evolution of Automotive Electronics

The modern automobile represents one of the most complex distributed computing systems in everyday use. What began in the 1970s as simple electronic fuel injection has evolved into a sophisticated network of interconnected processors, sensors, and actuators. Today's vehicles contain anywhere from thirty to over one hundred Electronic Control Units, each responsible for specific subsystems ranging from powertrain management to climate control, from advanced driver assistance systems to infotainment. This transformation has been driven by increasing demands for fuel efficiency, emissions control, safety features, and user comfort. However, this evolution has also introduced new vulnerabilities that were never anticipated when these communication protocols were first designed.

The heart of this distributed system is the Controller Area Network, commonly known as the CAN bus. Developed by Bosch in the mid-1980s and standardized in 1993 as ISO 11898, CAN was revolutionary for its time. It replaced the growing tangle of point-to-point wiring harnesses with a elegant multi-master bus topology that allowed any Electronic Control Unit to communicate with any other unit on the network. The protocol was designed for reliability in the harsh automotive environment, with robust error detection mechanisms and the ability to operate in electrically noisy conditions with temperatures ranging from negative forty to positive one hundred twenty-five degrees Celsius. The genius of CAN lies in its simplicity and its deterministic behavior, which makes it ideal for real-time control applications where timing is critical.

### 1.2 The Security Gap in Legacy Protocols

When Robert Bosch GmbH engineers designed the Controller Area Network in 1983, the automotive landscape was vastly different from today. Vehicles were isolated systems with no external connectivity. The idea that someone might remotely access a vehicle's internal network would have seemed like science fiction. The primary concerns were reliability, real-time performance, and cost efficiency. Security features like authentication, authorization, and encryption were not part of the design requirements because there was no threat model that required them. The engineers could not have anticipated that forty years later, vehicles would be connected to the internet through cellular modems, would communicate with smartphones via Bluetooth, and would receive over-the-air software updates.

The problem we face today is that the CAN protocol, designed in this pre-connectivity era, now forms the backbone of vehicles that are increasingly connected to external networks. Modern vehicles contain telematics units for emergency services, infotainment systems that connect to smartphones and cloud services, and wireless interfaces for keyless entry and tire pressure monitoring. Each of these connectivity points represents a potential entry vector for adversaries. Once an attacker gains access to any Electronic Control Unit connected to the CAN bus, they effectively have access to the entire vehicle network. The lack of authentication means they can impersonate any other control unit, the lack of encryption means they can read all traffic, and the broadcast nature of the bus means they can affect all systems simultaneously.

This security gap has moved from theoretical concern to demonstrated reality. Researchers have shown that it is possible to remotely compromise vehicles through vulnerabilities in cellular modems, exploit weaknesses in infotainment systems to gain CAN bus access, and inject malicious messages that can control critical safety systems like brakes and steering. These demonstrations have prompted automotive manufacturers, regulatory bodies, and security researchers to seek solutions that can retrofit security onto this legacy protocol without requiring a complete redesign of vehicle architectures.

### 1.3 Project Objectives and Scope

This project addresses the security challenges of the CAN protocol through a multi-faceted approach. Our primary objective is to demonstrate both the vulnerability of unprotected CAN networks and the feasibility of software-based defense mechanisms that can be deployed on resource-constrained embedded systems. Unlike many research projects that focus purely on the theoretical aspects of automotive security, we aim to create a practical, working demonstration that can be understood by engineers, students, and security professionals.

The first objective is educational. By constructing a low-cost hardware testbed using commercially available ESP32 microcontrollers and CAN transceivers, we make automotive security research accessible to a broader audience. The total hardware cost for our three-node testbed is under fifty dollars, making it affordable for universities, hobbyists, and small research labs. This democratization of automotive security research is important because it allows more people to understand these vulnerabilities and contribute to developing solutions.

The second objective is to implement and validate realistic attack scenarios. We develop what we call the "Red Team" firmware, which simulates the behavior of a compromised Electronic Control Unit that has been taken over by an adversary. Our focus is on the Denial of Service flooding attack, which is one of the most effective and difficult to defend against. This attack exploits the fundamental arbitration mechanism of CAN to monopolize the bus and prevent legitimate communications. By implementing this attack in our testbed, we can measure its effectiveness and understand its impact on network performance.

The third objective is to design and implement defensive countermeasures. We develop "Blue Team" firmware that incorporates an Intrusion Detection System capable of identifying malicious traffic in real-time. Our IDS uses a hybrid approach combining signature-based detection for known attack patterns with anomaly-based detection for unusual traffic characteristics. The challenge is to implement these detection algorithms on a microcontroller with limited processing power and memory while maintaining the real-time performance requirements of automotive systems.

The scope of this project is carefully bounded to make it achievable while still being meaningful. We focus specifically on the CAN 2.0B protocol at 500 kilobits per second, which is the standard configuration for many vehicle subsystems. We implement our system using ESP32 microcontrollers, which provide a good balance of processing power, built-in CAN controller, and low cost. We use the Rust programming language with the Embassy async framework, which provides memory safety guarantees critical for security-sensitive embedded systems. Our testbed consists of three nodes representing a simplified vehicle network, which is sufficient to demonstrate the attack and defense mechanisms while remaining manageable for a research project.

### 1.4 The Modern Threat Landscape for Connected Vehicles

Understanding the motivation for this project requires examining the current threat landscape for connected and autonomous vehicles. The transformation of automobiles from mechanical systems to software-defined platforms has fundamentally changed the security considerations. A modern luxury vehicle may contain over one hundred million lines of code, more than a commercial airliner or the software that powers a nuclear power plant. This complexity creates numerous opportunities for vulnerabilities.

The threat actors interested in automotive systems are diverse. Academic researchers have been at the forefront of discovering vulnerabilities, often working with manufacturers to improve security. Their work is motivated by the public interest in understanding and mitigating risks. Criminal organizations have shown interest in automotive hacking for various purposes including vehicle theft, ransomware attacks, and fraud. The traditional methods of stealing vehicles using copied key fobs have evolved into sophisticated attacks that exploit CAN bus vulnerabilities to bypass immobilizers and start engines without keys. Nation-state actors have studied automotive systems as potential targets for espionage, surveillance, and even as weapons in cyber-physical attacks. The interconnected nature of modern cities, where traffic management systems communicate with vehicles, creates new attack surfaces.

The consequences of automotive cyber attacks extend beyond financial loss or privacy concerns. Unlike traditional computer systems where a security breach might result in data theft or service disruption, attacks on vehicle networks can directly threaten human life. A successful attack that disables brakes while the vehicle is traveling at highway speeds, or one that causes sudden acceleration in heavy traffic, could result in serious injuries or fatalities. This places automotive security in a category similar to critical infrastructure protection and medical device security, where the stakes are measured in human lives rather than just dollars or data.

Regulatory responses to these threats have been evolving rapidly. The United Nations Economic Commission for Europe has adopted regulations requiring cybersecurity management systems for new vehicle types. The European Union's General Data Protection Regulation has implications for the telemetry data that vehicles collect and transmit. In the United States, various bills have been proposed to establish cybersecurity standards for connected vehicles. These regulatory frameworks recognize that automotive cybersecurity cannot be left solely to market forces and that baseline security standards are necessary to protect public safety.

---

## Chapter 2: The Controller Area Network Protocol - A Deep Dive

### 2.1 Physical Layer Architecture and Differential Signaling

To understand the vulnerabilities of the CAN protocol and how to defend against attacks, we must first thoroughly understand its operation at every layer. The physical layer of CAN is both elegant and robust, using differential signaling to achieve noise immunity that allows reliable communication in the electrically hostile environment of an automobile. Let us examine this in detail.

The physical medium of a CAN bus consists of two wires, designated CAN High and CAN Low, typically implemented as a twisted pair cable. The choice of twisted pair is not arbitrary but rather a fundamental aspect of the noise immunity strategy. When the two wires are twisted together, any electromagnetic interference from external sources such as ignition systems, alternators, or electric motors affects both wires approximately equally. Since the receiver measures the voltage difference between the two wires rather than the absolute voltage of either wire, this common-mode noise is effectively rejected.

The signaling works by manipulating the voltage levels on these two wires to represent binary data. The CAN specification defines two bus states: dominant and recessive. The dominant state, representing a logical zero, is created when the CAN transceiver drives CAN High to approximately three and a half volts and CAN Low to approximately one and a half volts. This creates a differential voltage of about two volts. The recessive state, representing a logical one, occurs when both CAN High and CAN Low are at the same voltage level, typically around two and a half volts, resulting in a differential voltage near zero.

The reason for this particular encoding scheme becomes clear when we consider what happens when multiple nodes attempt to transmit simultaneously. The CAN bus implements what is known as wired-AND logic. If one transceiver is driving the bus to the dominant state while another is allowing the bus to remain in the recessive state, the dominant state wins. This is a physical property of the electrical circuit, not something enforced by software. A recessive bit is essentially a high-impedance state where the bus is pulled to the recessive voltage by termination resistors. A dominant bit is actively driven, overriding the recessive state. This wired-AND behavior is the foundation of CAN's arbitration mechanism, which we will explore in detail later.

```
CAN Bus Physical Layer Signaling

Time →
CAN_H: ___/‾‾‾\___/‾‾‾\___/‾‾‾\___
       2.5V 3.5V  2.5V 3.5V  2.5V 3.5V

CAN_L: ‾‾‾\___/‾‾‾\___/‾‾‾\___/‾‾‾
       2.5V 1.5V  2.5V 1.5V  2.5V 1.5V

Diff:   0V  2V   0V  2V   0V  2V
State:  R   D    R   D    R   D
Bit:    1   0    1   0    1   0

R = Recessive (Logic 1)
D = Dominant (Logic 0)
```

Bus termination is another critical aspect of the physical layer that is often overlooked but essential for reliable operation. At each physical end of the CAN bus, a one hundred twenty ohm resistor must be placed between CAN High and CAN Low. These termination resistors serve multiple purposes. First, they provide the pull to the recessive voltage level when no node is driving the bus dominant. Second, and more importantly, they prevent signal reflections that would otherwise occur when the electrical wave reaches the end of the transmission line. Without proper termination, these reflections would interfere with the transmitted signal, causing bit errors and communication failures. The value of one hundred twenty ohms is chosen to match the characteristic impedance of the twisted pair cable, typically in the range of one hundred to one hundred twenty ohms for automotive-grade CAN cables.

### 2.2 Data Link Layer and Frame Structure

The data link layer of CAN is where the protocol's sophisticated message-based communication paradigm is implemented. Unlike many network protocols that use address-based communication where messages are sent from one specific node to another, CAN uses a content-based addressing scheme. Each message is identified not by its source or destination, but by its content identifier. This identifier serves dual purposes: it indicates what type of information the message contains, and it determines the priority of the message on the bus.

The standard CAN frame, also known as CAN 2.0A, uses an eleven-bit identifier field. This allows for two thousand and forty-eight unique message identifiers. For applications requiring more identifiers, the extended CAN frame format, or CAN 2.0B, provides a twenty-nine-bit identifier field, supporting over five hundred million unique identifiers. In practice, most automotive applications use standard frames, reserving the extended format for specialized diagnostics or future expansion.

Let us walk through the complete structure of a standard CAN frame as it appears on the bus. The frame begins with a single dominant bit called the Start of Frame, or SOF. This bit serves to synchronize all nodes on the bus to the beginning of the new message. Following the SOF comes the arbitration field, which contains the eleven-bit identifier and a single bit called the Remote Transmission Request, or RTR. The RTR bit distinguishes between data frames, which carry payload data, and remote frames, which are requests for data. In a data frame, the RTR bit is dominant (zero), while in a remote frame it is recessive (one).

After the arbitration field comes the control field, which contains several important pieces of information. The first bit is the Identifier Extension bit, or IDE, which indicates whether this is a standard or extended frame. This is followed by a reserved bit, which must be dominant. Then comes the Data Length Code, or DLC, which is a four-bit field indicating how many bytes of data are in the payload, ranging from zero to eight bytes. The actual data field follows, containing the number of bytes specified by the DLC.

Following the data comes a fifteen-bit Cyclic Redundancy Check, or CRC, which is used to detect transmission errors. The CRC is followed by a single recessive CRC delimiter bit. Next is the ACK slot, a fascinating aspect of the CAN protocol. The transmitting node sends this bit as recessive, but any node that has correctly received the message up to this point will overwrite this bit with a dominant level, thus acknowledging successful reception. This means that the transmitter receives immediate feedback about whether at least one other node on the bus has correctly received its message. The ACK slot is followed by a recessive ACK delimiter bit.

Finally, the frame concludes with the End of Frame field, consisting of seven recessive bits, and then an Interframe Space of three recessive bits before the bus returns to the idle state and becomes available for the next transmission.

```
Standard CAN 2.0A Frame Structure

┌─────┬──────────────────┬─────────┬──────────┬─────┬──────┬─────┬───────┐
│ SOF │   Arbitration    │ Control │   Data   │ CRC │ ACK  │ EOF │  IFS  │
│  1  │   ID(11) + RTR   │ 6 bits  │  0-64    │ 16  │  2   │  7  │   3   │
└─────┴──────────────────┴─────────┴──────────┴─────┴──────┴─────┴───────┘
       ↑                   ↑                     ↑
       Priority           Payload Size      Error Check
       (Lower ID = Higher Priority)
```

The beauty of this frame structure is that it provides all the necessary information for reliable message-based communication while remaining compact enough for the limited bandwidth of the physical layer. At five hundred kilobits per second, the maximum data rate commonly used in automotive applications, a full eight-byte data frame requires approximately one hundred thirty bits, resulting in a transmission time of about two hundred sixty microseconds. This allows for thousands of messages per second, sufficient for real-time control applications.

### 2.3 The Arbitration Mechanism - Priority-Based Bus Access

Perhaps the most ingenious aspect of the CAN protocol is its arbitration mechanism, which allows multiple nodes to contend for bus access in a deterministic, collision-free manner. Understanding this mechanism is crucial for understanding both the strengths of CAN and the vulnerabilities that attackers can exploit.

The arbitration process begins when the bus is idle, indicated by eleven consecutive recessive bits. Any node that has a message to transmit can begin transmission by sending the Start of Frame bit. If only one node begins transmission, it proceeds without interference. However, if multiple nodes begin transmitting simultaneously, they will initially be unaware of each other's presence because they are all sending the same SOF bit.

The arbitration occurs during the transmission of the identifier field. Each transmitting node sends its identifier bit by bit, starting with the most significant bit. Simultaneously, each node monitors the bus to see what bit level is actually present. As long as a node transmits a bit and sees the same bit level on the bus, it continues transmission. However, if a node transmits a recessive bit (one) but observes a dominant bit (zero) on the bus, it knows that another node is transmitting a message with higher priority. In this case, the node immediately stops transmitting and becomes a receiver. This process continues bit by bit until only one transmitting node remains.

The critical insight is that because of the wired-AND property of the physical layer, the message with the lowest numerical identifier value will always win arbitration. A message with identifier zero x zero zero zero would have the highest possible priority and would always win arbitration against any other message. Conversely, a message with identifier zero x seven F F (in standard format) would have the lowest priority.

Let us consider a concrete example to illustrate this process. Imagine three nodes attempting to transmit simultaneously. Node A has a message with identifier zero x one two three, Node B has identifier zero x one two four, and Node C has identifier zero x one three zero. All three nodes begin transmission and send the SOF bit. They then begin sending their identifiers bit by bit. The first several bits of all three identifiers are identical, so all nodes continue transmitting. However, when they reach the eighth bit from the left (counting from the most significant bit), Node C's identifier has a one while Nodes A and B have a zero. Node C observes the dominant level on the bus and knows it has lost arbitration. It stops transmitting and becomes a receiver. Nodes A and B continue, unaware that Node C has dropped out. They continue bit by bit until they reach the last bit of the identifier field. At this point, Node A sends a one while Node B sends a zero. Node A observes the dominant level, recognizes that it has lost arbitration, and stops transmitting. Node B continues and successfully transmits its message. After Node B's message is complete, Nodes A and C can retry their transmissions.

```
Arbitration Example (Binary IDs shown)

Time →  Bit:  1  2  3  4  5  6  7  8  9 10 11
        Bus:  0  0  0  0  0  0  0  0  0  1  0  ← Winning message
        
Node A (ID: 0x123 = 0001 0010 011): 0  0  0  0  0  0  0  1  0  1  1  LOSES at bit 8
Node B (ID: 0x124 = 0001 0010 010): 0  0  0  0  0  0  0  1  0  1  0  LOSES at bit 11
Node C (ID: 0x130 = 0001 0011 000): 0  0  0  0  0  0  0  1  1  X  X  LOSES at bit 9

Winner: Node C (ID: 0x130) - lowest numerical value
```

This arbitration mechanism has several important properties. First, it is completely deterministic. The same set of messages attempting to transmit simultaneously will always be prioritized in the same order. Second, it is non-destructive. Unlike Ethernet's CSMA/CD protocol where collisions result in corrupted frames that must be retransmitted, CAN arbitration results in the immediate successful transmission of the highest priority message with no data loss. Third, it provides bounded latency for high-priority messages. A critical safety message with a low identifier value will never wait longer than the time required to transmit one maximum-length lower-priority message before gaining bus access.

However, this elegant mechanism also creates a vulnerability that attackers can exploit. If a malicious node continuously transmits messages with identifier zero x zero zero zero, it will win every arbitration, effectively denying all other nodes access to the bus. This is the foundation of the flooding attack that we demonstrate in this project.

### 2.4 Error Detection and Fault Confinement Mechanisms

The CAN protocol incorporates multiple layers of error detection to ensure high reliability in noisy automotive environments. These mechanisms work together to detect transmission errors, corrupted frames, and malfunctioning nodes, automatically triggering retransmission or isolation as needed. Understanding these error detection mechanisms is essential for both implementing robust CAN systems and for understanding how they can be exploited or overwhelmed by attacks.

The first line of defense is the Cyclic Redundancy Check, which is calculated over the Start of Frame, arbitration field, control field, and data field. The transmitter calculates this fifteen-bit CRC using a standardized polynomial and includes it in the frame. Each receiver independently calculates the same CRC over the received bits and compares its calculated value with the received CRC field. Any mismatch indicates a transmission error, and the receiver will flag the error. The CRC is highly effective at detecting burst errors, random bit errors, and certain systematic errors that might result from electromagnetic interference or failing hardware.

The second error detection mechanism is bit monitoring. Every node that transmits a bit on the bus monitors the actual bus level during the bit time. If a transmitter sends a recessive bit but observes a dominant level on the bus, this indicates either that the node has lost arbitration (which is normal during the arbitration phase) or that there is a bit error (which is abnormal during the data phase). Similarly, if a node sends a dominant bit but observes a recessive level, this always indicates an error. This bit-level monitoring provides immediate error detection with no latency.

The third mechanism is bit stuffing, which serves both synchronization and error detection purposes. After any sequence of five consecutive bits of the same polarity, the transmitter automatically inserts a bit of the opposite polarity. Receivers expect this stuffing and automatically remove these bits. If a receiver detects six consecutive bits of the same polarity, it knows that a stuff error has occurred, either due to a transmission error or because the stuff bit was itself corrupted. This mechanism ensures that there are frequent bit transitions to maintain synchronization between all nodes, and it provides an additional layer of error detection.

Beyond detecting individual frame errors, CAN implements a sophisticated fault confinement mechanism that prevents a single malfunctioning node from disrupting the entire network. Every CAN controller maintains two error counters: the Transmit Error Counter, or TEC, and the Receive Error Counter, or REC. These counters are incremented when errors are detected and decremented when successful transmissions or receptions occur, with different weights for different types of errors.

When a node successfully transmits a message, its TEC is decremented. When a node successfully receives a message, its REC is decremented. However, when errors occur, the counters are incremented by larger amounts. A node that detects an error in a message it is receiving increments its REC by one. A node that detects an error in a message it is transmitting increments its TEC by eight. This asymmetry is intentional: it is designed to isolate transmitters that are consistently sending corrupted frames more quickly than receivers that might just be experiencing noisy conditions.

Based on these error counter values, a node can be in one of three states. The error active state is the normal operating state where error counters are below certain thresholds and the node can transmit and receive normally. If either error counter exceeds one hundred twenty-seven, the node enters the error passive state. In this state, the node can still transmit and receive, but it signals errors differently and must wait longer before attempting to retransmit after an error. This prevents an error-passive node from immediately disrupting retransmissions by other nodes. If the TEC exceeds two hundred fifty-five, the node enters the bus-off state and disconnects itself from the bus entirely. This prevents a severely malfunctioning node from completely disrupting network communication.

This fault confinement mechanism is generally effective at isolating hardware failures or nodes experiencing electrical problems. However, it can be overwhelmed by deliberate attacks. A malicious node that floods the bus with high-priority messages is behaving correctly from the CAN controller's perspective—it is winning arbitration legitimately and transmitting valid frames. The other nodes on the bus, which are losing arbitration repeatedly, may actually enter error-passive or even bus-off states because they interpret their arbitration losses as transmission errors. This inverted response, where the legitimate nodes are penalized while the attacker continues operating normally, makes the flooding attack particularly effective and difficult to counter using only the protocol's built-in mechanisms.

---

## Chapter 3: Security Vulnerabilities in Automotive Networks

### 3.1 The Absence of Authentication and Authorization

The most fundamental security weakness of the CAN protocol is its complete lack of authentication mechanisms. In modern security terminology, the CAN bus implements no concepts of identity, authentication, or authorization. Any node on the bus can send any message with any identifier at any time, and receiving nodes have no way to verify the source of a message or determine whether the sender is authorized to transmit that particular message type.

To understand the severity of this vulnerability, consider a typical automotive application. A modern vehicle might have an Engine Control Unit that sends periodic messages with identifier zero x zero A zero, containing information about engine RPM, coolant temperature, and throttle position. The instrument cluster receives these messages and displays the information to the driver. Other systems, such as the transmission control unit and the stability control system, also use this information for their control algorithms. Now imagine that an adversary has compromised the infotainment system and gained the ability to send arbitrary CAN messages. The attacker can send messages with identifier zero x zero A zero containing false information. Perhaps the attacker sends messages indicating that the engine is overheating when it is not, or that the throttle is fully closed when the driver is actually accelerating. The receiving Electronic Control Units have no way to distinguish these malicious messages from legitimate ones. There is no digital signature, no encryption, no identity field that they can check. They will process the false data as if it were genuine.

The consequences of this authentication gap extend beyond simple data spoofing. In many vehicles, certain CAN messages trigger immediate physical actions. A message with a specific identifier might command the brake actuators to apply braking force, or command the electronic power steering to adjust assist levels, or command door lock actuators to engage. If an attacker can send these command messages, they can directly control critical vehicle functions. This is not theoretical—multiple research teams have demonstrated these attacks on production vehicles, showing that remote adversaries can disable brakes, apply unexpected acceleration, or disable critical safety systems.

The root cause of this vulnerability lies in the design philosophy of the original CAN specification. When CAN was designed in the 1980s, the assumption was that all nodes on the bus were trusted. The network was physically isolated within the vehicle, and there was no concept of external connectivity. The designers focused on reliability, real-time performance, and cost efficiency. Adding authentication would have required additional message overhead, potentially complex cryptographic operations that would be expensive to implement in the microcontrollers of that era, and key management infrastructure that would add complexity to vehicle manufacturing and service. These were considered unacceptable costs for a threat that did not exist at the time.

Today, we face the difficult challenge of retrofitting security onto this legacy protocol. Various approaches have been proposed, including message authentication codes appended to CAN frames, intrusion detection systems that analyze traffic patterns, and hardware firewalls that segment the network. Each approach involves tradeoffs between security, performance, backwards compatibility, and cost. Our project explores the intrusion detection approach, which can be implemented in software without requiring changes to existing Electronic Control Units or the CAN protocol itself.

### 3.2 The Lack of Confidentiality and Privacy Implications

Closely related to the authentication problem is the complete absence of encryption in the CAN protocol. Every message transmitted on the CAN bus is sent in plaintext, with no confidentiality protection whatsoever. Any node on the bus can receive and read every message, including messages not intended for it. In many vehicles, even the OBD-II diagnostic port provides direct access to read all CAN traffic, requiring no special tools beyond a simple CAN interface adapter.

The implications for privacy and security are significant. Consider the wealth of information that can be gleaned from CAN traffic. Vehicle speed is transmitted continuously, allowing an attacker to track the driver's movements and determine when the vehicle is traveling and when it is parked. GPS coordinates are often transmitted on the CAN bus by navigation systems. Door lock status, window positions, seatbelt usage, airbag readiness—all of this information is available in plaintext to anyone with physical access to the bus. In modern vehicles with cellular connectivity, if an attacker can compromise the telematics unit, they can remotely monitor all of this information without ever physically approaching the vehicle.

Beyond privacy concerns, the lack of encryption facilitates other attacks. Replay attacks become trivial when messages are unencrypted. An attacker can record a sequence of messages that perform some action, such as unlocking the doors or disabling the alarm system, and then replay these messages at a later time to repeat the action. Reverse engineering vehicle networks becomes much easier when all traffic is visible. Security researchers have published extensive databases of CAN message identifiers and their meanings for various vehicle models, information that was gathered simply by observing plaintext traffic.

Some might argue that encryption would be unnecessary overhead for a network that is supposedly physically isolated. However, as we have discussed, modern vehicles are no longer isolated. They have multiple external interfaces, and any of these can serve as an entry point for attackers. The infotainment system might have vulnerabilities in its web browser or Bluetooth stack. The cellular modem might be exploitable through malformed data packets. The wireless tire pressure monitoring system might use weak encryption that can be broken. Once an attacker penetrates any of these external interfaces and gains a foothold on a connected Electronic Control Unit, the lack of CAN encryption gives them full visibility into all vehicle systems.

Implementing encryption on CAN faces similar challenges to implementing authentication. The bandwidth is limited, and encryption would add overhead to every message. The microcontrollers in many existing Electronic Control Units may lack the processing power to perform encryption in real-time while maintaining their control loop timing requirements. Key management presents significant challenges: how would encryption keys be provisioned during vehicle manufacturing, how would they be managed during the vehicle's lifetime, how would service technicians gain access to encrypted communications during repairs? Despite these challenges, several research groups and industry consortia are developing solutions, including the AUTOSAR Secure Onboard Communication specification and various lightweight cryptographic schemes designed specifically for automotive networks.

### 3.3 The Broadcast Topology and Network Segmentation Issues

The third fundamental security weakness of CAN networks is the broadcast topology combined with the lack of network segmentation. In CAN, every message is received by every node on the bus. There is no concept of unicast or point-to-point communication at the protocol level. When a node transmits a message, it is simultaneously received by all other nodes. Each node uses hardware acceptance filters to ignore messages it does not need, but the messages are still physically present on the bus and consume bandwidth.

From a security perspective, this broadcast topology creates several problems. First, it means that a single compromised node can affect the entire network. If one Electronic Control Unit is taken over by an attacker, that node can transmit malicious messages that are received by all other nodes. There is no way to isolate the compromised node or limit the scope of its communications without physically disconnecting it from the bus.

Second, the broadcast topology amplifies the impact of denial-of-service attacks. A flooding attack that saturates the bus prevents all legitimate communications across the entire network. It is not possible to maintain critical communications on one part of the network while isolating the attacked portion, as one might do with a switched Ethernet network or segmented network topology. When the bus is saturated, all systems are affected simultaneously.

Third, the lack of segmentation makes it difficult to implement security zones or trust boundaries within the vehicle network. In modern IT security, the principle of network segmentation is used to limit the impact of compromises. For example, a corporate network might segment the guest WiFi network from the internal business network, so that a compromised guest device cannot access sensitive internal systems. In a vehicle, we might want to segment the infotainment system, which has external interfaces and runs complex software vulnerable to compromise, from the critical safety systems like brakes and airbags. However, if these systems are all on the same CAN bus, they can all communicate directly with each other, and the compromise of the infotainment system immediately provides access to the safety-critical systems.

Some modern vehicles do implement multiple separate CAN buses to provide some degree of segmentation. A typical configuration might have a powertrain CAN bus for engine and transmission control, a chassis CAN bus for suspension and braking systems, a comfort CAN bus for climate control and seating, and an infotainment CAN bus for entertainment and navigation systems. These separate buses are connected through gateway Electronic Control Units that can filter messages and control which information flows between buses. This provides some security benefit, but it is not a complete solution. The gateway itself becomes a critical security component that must be carefully designed and protected. If the gateway is compromised, the attacker gains access to all connected networks. Additionally, many vehicles have complex interconnections between systems that require information to flow across these boundaries, creating potential attack paths.

Our demonstration system, like many actual vehicle networks, consists of a single CAN bus with all nodes connected. This represents the worst-case scenario from a security perspective but is actually quite common in real vehicles, particularly in less expensive models or in vehicles from earlier generations when network segmentation was not a significant concern.

---

## Chapter 4: Advanced Attack Methodologies Against CAN Networks

### 4.1 Denial of Service Through Bus Flooding

The denial-of-service flooding attack is one of the most straightforward yet effective attacks against CAN networks. It exploits the arbitration mechanism we discussed earlier to monopolize bus bandwidth and prevent legitimate communications. Let us examine this attack in detail, understanding both its implementation and its devastating effects on network operations.

The fundamental concept behind the flooding attack is deceptively simple. The attacker continuously transmits messages with the highest possible priority, which means using identifier zero x zero zero zero. Because of the deterministic arbitration mechanism of CAN, these high-priority messages will always win arbitration against any other messages on the bus. If the attacker can generate these messages faster than legitimate nodes can complete their transmissions, the attacker effectively gains complete control of the bus, and no other communication can occur.

To understand why this is so effective, we must consider the timing characteristics of CAN communication. At a bus speed of five hundred kilobits per second, which is common in automotive applications, a maximum-length CAN frame containing eight bytes of data requires approximately one hundred thirty bits to transmit. This includes the start of frame bit, eleven bits for the identifier in standard format, six bits for the control field, sixty-four bits for eight bytes of data, sixteen bits for the CRC and delimiters, two bits for the acknowledgment field, seven bits for the end of frame, and three bits for the interframe spacing. The total transmission time is approximately two hundred sixty microseconds.

Now consider what happens when our attacker begins flooding the bus. The attacker's node continuously generates frames with identifier zero x zero zero zero and immediately attempts to transmit them. As soon as one frame completes transmission, the attacker begins the next one. If any other node attempts to transmit during this continuous stream, it will lose arbitration during the very first bits of the identifier field, because the attacker's zeros will dominate over any one bits from the legitimate sender. The legitimate node must then wait for the attacker's frame to complete before it can try again, but by that time the attacker has already begun transmitting another frame, and the cycle repeats indefinitely.

The impact of this attack extends beyond simply preventing communication. The CAN protocol's error handling mechanisms can actually make the situation worse for legitimate nodes. Remember that when a node loses arbitration, its transmit error counter is incremented according to certain rules. If a node repeatedly loses arbitration and its error counters exceed the thresholds we discussed earlier, the node may enter the error-passive state or even the bus-off state, effectively disconnecting itself from the network. This means that the flooding attack can not only prevent legitimate communications but can actually cause legitimate nodes to remove themselves from the bus, even though they are functioning correctly. The attacker, meanwhile, continues operating in the error-active state because from the CAN controller's perspective, it is successfully transmitting valid frames.

The real-world consequences of such an attack in a vehicle context are severe. Consider that modern vehicles rely on continuous CAN communication for critical safety functions. The anti-lock braking system needs constant feedback about wheel speeds to prevent wheel lockup during braking. The electronic stability control system needs information about steering angle, yaw rate, and lateral acceleration to prevent skids and maintain vehicle stability. The airbag system monitors crash sensors to determine when to deploy. If the CAN bus is flooded and these critical messages cannot be transmitted, the safety systems may fail to operate correctly or may enter failsafe modes that degrade vehicle performance or safety.

```
CAN Bus Flooding Attack Visualization

Normal Operation:
Time → |Node1|Node2|Node1|Node3|Node2|Node1| (Shared bus access)

During Flood Attack:
Time → |Attacker|Attacker|Attacker|Attacker|Attacker| (100% utilization)
          (ID:0x000) continues indefinitely

Result: Legitimate nodes cannot transmit
        - Node1 loses arbitration repeatedly → TEC increases
        - Node2 loses arbitration repeatedly → TEC increases  
        - Node3 loses arbitration repeatedly → TEC increases
        Eventually: Legitimate nodes enter Error Passive or Bus-Off state
```

Implementing the flooding attack in our testbed is remarkably straightforward, which illustrates how accessible these attacks are to adversaries with even modest technical capabilities. Our attacker firmware, which we designate as the "evil_doggie" module in reference to the malicious nature of the attack, implements a simple state machine. When commanded to begin the attack, it enters a tight loop that continuously constructs CAN frames with identifier zero x zero zero zero and maximum data length of eight bytes. The payload data itself is irrelevant for the denial-of-service effect, so we fill it with arbitrary values such as zero x F F repeatedly. The microcontroller's CAN peripheral is then commanded to transmit this frame. As soon as the transmission completes, the loop immediately constructs and transmits the next frame, maintaining continuous bus occupancy.

The firmware must handle one practical consideration: the CAN controller has finite transmit buffers. If the software attempts to queue frames faster than the hardware can transmit them, the transmit buffer will fill up. Our implementation handles this by checking the buffer status and entering a brief busy-wait loop if necessary, but in practice at five hundred kilobits per second, the ESP32's CAN controller can keep up with our software's frame generation rate, so the buffer rarely fills.

One might ask why we do not simply use a higher identifier value or send frames less frequently. The answer is that the effectiveness of the attack depends critically on maintaining continuous bus occupation with the highest priority messages. If we used a lower priority identifier, legitimate messages with higher priorities could still be transmitted. If we introduced gaps between our attack frames, legitimate nodes could transmit during those gaps. The attack succeeds because it provides no opportunities whatsoever for other nodes to gain bus access.

### 4.2 The Janus Attack - Exploiting Temporal Characteristics

While the flooding attack exploits the arbitration mechanism, the Janus attack represents a more sophisticated exploitation of the physical and timing characteristics of CAN. Named after the two-faced Roman god, this attack allows an adversary to send a message that appears different to different receivers on the same bus, potentially bypassing security mechanisms that rely on identifier-based filtering or monitoring.

The Janus attack exploits subtle differences in how different CAN controllers sample the bus signal to determine bit values. In the CAN physical layer, each bit time is divided into several segments: the synchronization segment, the propagation time segment, phase segment one, and phase segment two. The sample point, where the controller reads the bus voltage to determine whether the bit is dominant or recessive, occurs at the boundary between phase segment one and phase segment two. The exact location of this sample point as a percentage of the bit time can be configured differently on different controllers and may vary slightly between different implementations.

An attacker performing a Janus attack manipulates the timing of bit transitions to create a signal that will be sampled differently by different receivers. Imagine that the attacker wants to send a message that appears to have identifier zero x one zero zero to some receivers (who might allow this through their filters) while appearing to have identifier zero x zero zero zero to other receivers (causing them to react as if it were a critical high-priority message). The attacker carefully times the voltage transitions on the bus so that they occur within the sample point window of some controllers but outside the sample point window of others. This requires precise control of the CAN transceiver and detailed knowledge of the target controllers' configurations.

The practical implementation of a Janus attack is significantly more complex than a flooding attack. It requires hardware capable of very precise timing control, often necessitating custom FPGA-based CAN controllers rather than standard microcontroller peripherals. The attacker must also have detailed knowledge of the target vehicle's network topology and the sampling configurations of the various Electronic Control Units. For these reasons, while the Janus attack is a demonstrated vulnerability that has been published in academic security research, it is less commonly discussed in practical threat scenarios than simpler attacks like flooding or message injection.

However, the existence of the Janus attack has important implications for security mechanisms. Simple identifier-based filters or intrusion detection systems that only monitor message identifiers may be defeated if an attacker can make malicious messages appear to have benign identifiers. Defense mechanisms must therefore look at multiple characteristics of traffic, including not just message identifiers but also timing patterns, payload characteristics, and overall traffic statistics. Our intrusion detection system, while not specifically designed to detect Janus attacks, uses anomaly-based detection that monitors traffic frequency and patterns rather than relying solely on identifier filtering.

### 4.3 Fuzzing and Replay Attacks

Beyond denial-of-service and timing-based attacks, adversaries can employ fuzzing and replay techniques that are common in general cybersecurity but take on particular characteristics in the automotive context. Fuzzing involves sending malformed or unexpected messages to discover vulnerabilities in how Electronic Control Units process CAN data. Replay attacks involve recording legitimate message sequences and retransmitting them at inappropriate times to cause unintended behaviors.

Fuzzing attacks against CAN networks target the application layer processing that occurs after a message is received. While the CAN controller itself will reject messages with invalid CRC values or format errors, messages that are valid at the CAN protocol level but contain unexpected or malicious payloads will be passed up to the application software running on the Electronic Control Unit. If this application software does not properly validate the data it receives, various vulnerabilities may be exploited. Buffer overflows could occur if the software assumes certain data length characteristics. Integer overflows might happen if the software performs arithmetic operations on payload data without checking for overflow conditions. State machine confusion could result if messages arrive in unexpected sequences.

A systematic fuzzing campaign against a vehicle's CAN network might proceed by identifying all unique message identifiers present on the bus through passive monitoring. For each identifier, the attacker then generates variants with different payload values, cycling through edge cases such as all zeros, all ones, alternating patterns, and boundary values for any parsed fields. These fuzzed messages are transmitted while monitoring the vehicle for unusual behaviors such as warning lights, performance changes, or system resets. Any unusual responses indicate potential vulnerabilities that could be further explored and potentially exploited.

Replay attacks are particularly effective against systems that do not implement any form of replay protection such as sequence numbers or timestamps. An attacker might record the message sequence transmitted when a driver presses the unlock button on their key fob. If these messages are transmitted on the CAN bus from the remote keyless entry receiver to the body control module, the attacker could later replay these exact messages to unlock the vehicle, even without possessing the key fob. Similarly, an attacker might record diagnostic commands that perform sensitive operations like flashing firmware or clearing fault codes, then replay these commands later to perform unauthorized maintenance operations or mask evidence of tampering.

The effectiveness of replay attacks varies depending on the specific implementation of vehicle systems. Some modern vehicles do implement sequence numbers in their messages, incrementing a counter with each transmission and rejecting messages with out-of-sequence counter values. However, the implementation of these protections is inconsistent across different vehicle models and manufacturers, and many systems remain vulnerable to simple replay attacks.

```
Fuzzing Attack Strategy Flow

Step 1: Reconnaissance
    ↓
[Monitor CAN Bus] → Identify active message IDs
    ↓
Step 2: Test Case Generation  
    ↓
For each ID: Generate payload variants
    - Boundary values (0x00, 0xFF)
    - Invalid DLC values
    - Malformed data structures
    ↓
Step 3: Injection & Monitoring
    ↓
[Transmit Fuzzed Messages] → [Monitor ECU Responses]
    ↓
Step 4: Analysis
    ↓
Document: Crashes, Errors, Unexpected Behaviors
    ↓
Step 5: Exploitation Development
```

---

## Chapter 5: System Design Philosophy and Architecture

### 5.1 Defense-in-Depth Strategy and Intrusion Detection

When approaching the problem of securing CAN networks, we must acknowledge that there is no single silver bullet solution. The security vulnerabilities are fundamental to the protocol design, and truly comprehensive security would require modifications to the protocol itself, changes to the hardware in millions of deployed Electronic Control Units, and entirely new approaches to automotive network architecture. Such comprehensive changes are not practical for existing vehicles or even for vehicles currently in development, given the long lead times in automotive engineering.

Instead, we must adopt a defense-in-depth strategy that layers multiple security mechanisms to reduce risk even when individual mechanisms can be circumvented. This approach is borrowed from cybersecurity best practices and military defensive strategy, where multiple overlapping protective measures are used so that the failure of any single defense does not result in complete compromise. In the context of automotive networks, a defense-in-depth approach might include physical security controls to limit access to diagnostic ports, network segmentation to isolate critical systems, cryptographic authentication where processing power permits, and intrusion detection systems to identify and respond to attacks in progress.

Our project focuses specifically on the intrusion detection component of this defense-in-depth strategy. An Intrusion Detection System, or IDS, is a security mechanism that monitors network traffic or system behavior to identify potential attacks or policy violations. IDS technology has been extensively developed for traditional IT networks, where systems like Snort and Suricata have become industry standards. However, adapting IDS concepts to the automotive domain presents unique challenges that require careful consideration.

The resource constraints of automotive systems are far more severe than those of traditional IT infrastructure. A typical server-based IDS might run on hardware with multiple processor cores, gigabytes of memory, and no strict real-time requirements. An automotive IDS must run on microcontrollers with megahertz clock speeds, kilobytes of RAM, and must process traffic in real-time without introducing latency that could affect control system timing. The IDS cannot simply log suspicious traffic for later analysis by a security operations center; it must make immediate decisions about whether to allow or block traffic, and these decisions must be made fast enough to keep up with the message rates on the CAN bus.

The attack detection problem is also fundamentally different in automotive networks compared to traditional networks. In IT security, intrusion detection often focuses on identifying malware signatures, unusual access patterns, or exploitation of known vulnerabilities. In automotive networks, many attacks involve sending messages that are perfectly valid at the protocol level but inappropriate for the current operational context. A message commanding the brakes to activate is not inherently malicious—such messages are legitimate and necessary during normal vehicle operation. The same message becomes malicious only when sent at an inappropriate time or by an unauthorized entity. This context-dependent nature of threats makes automotive intrusion detection particularly challenging.

### 5.2 Signature-Based versus Anomaly-Based Detection Approaches

Intrusion detection systems generally fall into two categories: signature-based and anomaly-based. Understanding the strengths and weaknesses of each approach is essential for designing an effective automotive IDS.

Signature-based detection, also called misuse detection, works by comparing observed traffic or behavior against a database of known attack patterns. These signatures are carefully crafted descriptions of specific attacks, similar to virus signatures used by antivirus software. When the IDS observes traffic that matches a signature, it triggers an alert or blocking action. The advantages of signature-based detection are its high accuracy and low false positive rate. When a signature matches, we can be quite confident that an actual attack is occurring. The detection process is also computationally efficient, often requiring only pattern matching or simple comparisons.

However, signature-based detection has significant limitations. Most critically, it can only detect attacks for which signatures have been created. A novel attack that does not match any existing signature will go undetected. This limitation is particularly problematic in automotive security, where the threat landscape is still evolving and new attack techniques are regularly discovered by researchers. Creating and maintaining comprehensive signature databases is also labor-intensive and requires constant updates as new vulnerabilities are discovered.

Anomaly-based detection, also called behavior-based detection, takes a fundamentally different approach. Instead of looking for known bad patterns, it establishes a baseline of normal behavior and alerts on significant deviations from this baseline. For example, an anomaly-based IDS might learn that under normal conditions, messages with identifier zero x one two three appear on the bus at approximately ten hertz with minimal variation. If the system suddenly observes these messages at one hundred hertz, or if they disappear entirely, this deviation from the baseline triggers an alert.

The primary advantage of anomaly-based detection is its ability to detect unknown attacks, including zero-day exploits and novel attack techniques. If an attacker uses a completely new method to flood the bus or inject malicious messages, an anomaly-based system may still detect it based on the unusual traffic patterns created. This makes anomaly-based detection particularly valuable in automotive applications, where we cannot anticipate all possible attack vectors.

The disadvantage of anomaly-based detection is a higher false positive rate. Normal vehicle operation can include legitimate events that deviate from baseline behavior. For example, emergency braking will generate traffic patterns very different from normal driving. The IDS must be sophisticated enough to distinguish between legitimate emergencies and attacks, which is not always straightforward. Additionally, anomaly-based detection requires a training period to establish the baseline of normal behavior, and this baseline may need to be updated as vehicle software is updated or as the vehicle ages and component behavior changes.

Our implementation uses a hybrid approach that combines elements of both signature-based and anomaly-based detection. We maintain a blocklist of message identifiers that have been identified as suspicious or malicious, providing signature-based protection. Simultaneously, we implement frequency analysis that monitors the rate at which messages appear on the bus, providing anomaly-based protection against flooding attacks. This hybrid approach aims to capture the advantages of both techniques while mitigating their individual weaknesses.

### 5.3 Host-Based versus Network-Based Implementation

Another important architectural decision is whether to implement the IDS as a host-based system or a network-based system. In traditional IT security, host-based IDS runs on individual computers and monitors the behavior of that specific system, while network-based IDS operates at network chokepoints and monitors all traffic passing through.

In the automotive context, a host-based IDS would be integrated into each individual Electronic Control Unit, monitoring the messages that unit receives and potentially blocking suspicious messages before they are processed by the application software. A network-based IDS would be implemented as a separate gateway device that sits on the CAN bus and monitors all traffic, potentially intervening to block malicious messages before they reach any Electronic Control Units.

Each approach has merits. A network-based approach provides a centralized point of visibility and control. A single well-protected gateway with greater processing resources than individual Electronic Control Units could implement sophisticated detection algorithms and maintain more extensive logs. It could enforce security policies across the entire network and segment traffic between different security zones. However, a network-based gateway also represents a single point of failure. If the gateway itself is compromised, the attacker gains the ability to manipulate or block all network traffic. The gateway must also be placed carefully in the network topology to ensure it can see and control all relevant traffic.

A host-based approach distributes the security functionality across multiple Electronic Control Units. Each unit becomes responsible for validating the messages it receives. This distribution reduces the impact of any single compromise and aligns well with the principles of defense-in-depth. It also allows each Electronic Control Unit to implement security policies specific to its function and requirements. However, host-based approaches require modifying multiple Electronic Control Units, increasing development and testing effort. The resource limitations of individual units may also restrict the sophistication of detection algorithms that can be implemented.

Our project implements a host-based approach, integrating the IDS directly into the microcontroller firmware that also handles normal message reception and processing. This decision was driven partly by the educational goals of the project—demonstrating that effective intrusion detection can be implemented even on resource-constrained embedded systems—and partly by the practicalities of our testbed where we have full control over the firmware running on each node. In a production vehicle implementation, a combined approach might be most effective, with lightweight host-based defenses on individual Electronic Control Units supplemented by a more sophisticated network-based gateway providing centralized monitoring and response capabilities.

### 5.4 The Hardware Foundation: ESP32 and CAN Transceivers

The hardware platform for our demonstration system must balance several competing requirements. It must be affordable enough that the project can be replicated by students and researchers with limited budgets. It must be readily available from commercial sources without requiring specialized procurement or manufacturing. It must provide sufficient processing power and memory to implement both the attack scenarios and the defense mechanisms. And it must include or support connection to CAN bus hardware so we can operate an actual CAN network rather than just simulating one in software.

The ESP32 microcontroller, designed by Espressif Systems, meets all of these requirements remarkably well. Originally developed and marketed primarily for Internet of Things applications, the ESP32 has become extremely popular in embedded systems education and hobbyist projects due to its powerful specifications and low cost. A complete ESP32 development board can be purchased for under ten dollars from numerous suppliers, and the chip itself is well-documented with extensive community support.

From a technical perspective, the ESP32 provides a dual-core processor running at up to two hundred forty megahertz, two hundred eighty kilobytes of static RAM, and four megabytes of flash memory in typical configurations. For our purposes, the most important feature is the built-in TWAI controller. TWAI, which stands for Two-Wire Automotive Interface, is Espressif's implementation of a CAN 2.0B compatible controller. It provides all the functionality we need: frame transmission and reception, hardware acceptance filtering, error counting, and bus-off recovery. The TWAI peripheral handles the bit-level protocol operations in hardware, freeing the processor to focus on higher-level message processing and security functions.

However, the ESP32's TWAI controller provides only the digital logic-level interface to the CAN protocol. To actually connect to a physical CAN bus, we need a CAN transceiver that interfaces between the microcontroller's three-volt three logic levels and the differential voltages of the physical bus. The SN65HVD230 transceiver from Texas Instruments is an ideal choice for this application. It operates at three-volt three logic levels, matching the ESP32's I/O voltage. It provides robust electrical protection, including electrostatic discharge protection up to sixteen kilovolts, which is important given the electrical noise in automotive environments. And like the ESP32 itself, it is readily available and inexpensive, typically costing less than two dollars per unit.

The interface between the ESP32 and the SN65HVD230 is straightforward. Two GPIO pins from the ESP32 connect to the transceiver: the TX pin carries outgoing data from the microcontroller to the transceiver, and the RX pin carries incoming data from the transceiver to the microcontroller. The transceiver's CAN_H and CAN_L pins then connect to the corresponding wires of the CAN bus. The transceiver handles all the electrical details of driving the bus to the proper voltage levels and reading the differential voltage to determine the bus state.

```
Hardware Architecture Diagram

┌─────────────────────────────────────────┐
│           ESP32 Module                   │
│  ┌──────────────────────────────────┐   │
│  │  Dual-Core Xtensa LX6            │   │
│  │  240 MHz, 520KB RAM              │   │
│  │                                  │   │
│  │  ┌────────────────┐              │   │
│  │  │ TWAI Controller│              │   │
│  │  │ (CAN 2.0B)     │              │   │
│  │  └────────┬───────┘              │   │
│  └───────────┼──────────────────────┘   │
│              │                          │
│         TX ──┼── RX                     │
└─────────────┼───┼──────────────────────┘
              │   │
       ┌──────▼───▼──────┐
       │   SN65HVD230    │
       │   CAN Transceiver│
       │   3.3V Compatible│
       └──────┬───┬───────┘
              │   │
        CAN_H │   │ CAN_L
              │   │
     ═════════╪═══╪════════  CAN Bus (Twisted Pair)
              │   │
         [120Ω Termination at each end]
```

### 5.5 Software Architecture and the Choice of Rust

The choice of programming language and software architecture for an embedded security system is critical. The language must provide sufficient performance to handle real-time processing at CAN bus data rates. It must allow direct control of hardware peripherals. And most importantly for a security application, it must help prevent the types of software vulnerabilities that attackers commonly exploit.

Traditional embedded systems development has been dominated by C and C++. These languages provide excellent performance and hardware control, but they also allow numerous categories of memory safety errors that have been the source of countless security vulnerabilities over the decades. Buffer overflows, use-after-free errors, null pointer dereferences, and data races between threads are all possible in C and C++, and all have been exploited in real-world attacks. An intrusion detection system implemented in an unsafe language might itself become an attack vector if adversaries can exploit vulnerabilities in the IDS code.

Rust is a systems programming language that provides memory safety guarantees without requiring a garbage collector. The Rust compiler enforces strict ownership and borrowing rules that make it impossible to write code with buffer overflows, dangling pointers, or data races, at least in the safe subset of the language. Code that might violate memory safety simply will not compile. This provides strong assurances that our IDS implementation will not itself introduce vulnerabilities.

Beyond safety, Rust provides excellent performance through zero-cost abstractions. The compiler performs aggressive optimizations and generates machine code that is competitive with carefully written C. The language includes powerful abstractions like iterators, pattern matching, and trait-based polymorphism that make code more maintainable and correct without sacrificing runtime performance. For embedded systems specifically, Rust has excellent support through the embedded Rust ecosystem, including hardware abstraction layers for many popular microcontrollers including the ESP32.

The Embassy framework, which we use for our implementation, brings async/await programming to embedded Rust. This allows us to write concurrent code in a style similar to async programming in languages like Python or JavaScript, but with the efficiency and safety guarantees of Rust. Embassy's async executor allows multiple tasks to run concurrently on a single processor core through cooperative multitasking. This is perfect for our application, where we need to simultaneously handle incoming CAN messages, manage a serial console interface for user interaction, implement the intrusion detection logic, and potentially transmit outgoing messages. Without async/await, we would need to either use a real-time operating system with preemptive multitasking (adding complexity and overhead) or manually structure our code as a complex state machine (reducing maintainability).

The software architecture centers around several asynchronous tasks that run concurrently. The receive task continuously monitors the CAN bus for incoming messages, passing each received frame to the IDS for inspection. The IDS task implements the detection algorithms, maintaining state about recent traffic patterns and updating the blocklist as needed. The serial task handles the command-line interface, allowing an operator to issue commands, view statistics, and control the operation of the system. In the attacker firmware, an additional task implements the attack state machine, generating and transmitting malicious frames when commanded. Embassy's executor coordinates these tasks, switching between them as they yield control while waiting for events, ensuring that each task makes progress and that timing-critical operations like frame reception are handled promptly.

---

## Chapter 6: Implementation Details

### 6.1 Physical Construction and Circuit Design

The physical construction of our testbed begins with careful attention to the electrical characteristics that ensure reliable CAN communication. While CAN is designed to be robust, achieving error-free operation requires proper implementation of the physical layer, particularly with respect to bus termination and signal integrity.

Our testbed consists of three ESP32 development boards, each connected to an SN65HVD230 transceiver breakout board. The connections between the ESP32 and transceiver are straightforward: we select two unused GPIO pins on the ESP32 and configure them as the TWAI TX and RX signals through software. These connect directly to the corresponding pins on the transceiver. Power and ground connections complete the microcontroller-to-transceiver interface. We use development boards rather than bare chips because the boards include voltage regulation, USB-to-serial conversion for programming and debugging, and the necessary supporting components, greatly simplifying the hardware setup.

The CAN bus itself requires more careful consideration. In a professional implementation, we would use twisted-pair cable with specified characteristic impedance, typically in the range of one hundred to one hundred twenty ohms. For our demonstration testbed, we use standard jumper wires on a breadboard, which is adequate for the short distances involved (less than one meter total bus length) and the moderate data rate of five hundred kilobits per second. At higher data rates or longer distances, proper cabling would become essential.

The critical element for reliable operation is proper bus termination. The CAN specification requires one hundred twenty ohm resistors at each physical end of the bus. These termination resistors serve two purposes. First, they pull the bus to the recessive state when no node is actively driving it dominant. Second, and more importantly, they prevent signal reflections. When an electrical signal travels down a transmission line and reaches a discontinuity, such as an open end, a portion of the signal is reflected back along the line. These reflections can interfere with the original signal, causing bit errors. Termination resistors with resistance matching the characteristic impedance of the cable absorb the signal energy, preventing reflections.

In our testbed, we identify the two nodes that are physically at the ends of the bus topology—in our case, the sender node and the attacker node—and place one hundred twenty ohm resistors between their CAN_H and CAN_L connections. The middle node, which will run our IDS receiver firmware, connects to the bus without termination. This creates the proper electrical environment for reliable communication.

```
Physical Wiring Diagram

Node 1 (Sender)          Node 2 (Receiver/IDS)       Node 3 (Attacker)
     ESP32                      ESP32                       ESP32
       │                          │                           │
   ┌───┴───┐                  ┌───┴───┐                   ┌───┴───┐
   │TX  RX │                  │TX  RX │                   │TX  RX │
   └─┬───┬─┘                  └─┬───┬─┘                   └─┬───┬─┘
     │   │                      │   │                       │   │
  ┌──▼───▼──┐                ┌──▼───▼──┐                 ┌──▼───▼──┐
  │SN65HVD  │                │SN65HVD  │                 │SN65HVD  │
  │  230    │                │  230    │                 │  230    │
  └─┬─────┬─┘                └─┬─────┬─┘                 └─┬─────┬─┘
    │     │                    │     │                     │     │
  H │     │ L                H │     │ L                 H │     │ L
    │     │                    │     │                     │     │
   [120Ω]════════════════════════════════════════════[120Ω]
    │                           │                           │
  CAN_H ─────────────────────────────────────────────── CAN_H
  CAN_L ─────────────────────────────────────────────── CAN_L
    │                           │                           │
  Termination              No Termination              Termination
  at bus end                                          at bus end
```

Signal integrity also depends on proper grounding. All three nodes must share a common ground reference. In our breadboard implementation, we connect all ground pins to a common rail. In a vehicle environment, this common ground is provided by the chassis, to which all Electronic Control Units connect. Without a proper ground reference, the differential voltage measurements would be unreliable, leading to communication errors.

Once the hardware is assembled, we can verify proper operation before loading our custom firmware. Using standard CAN analysis tools or even simple test firmware that transmits periodic messages, we can confirm that frames are being successfully transmitted and received. We can use an oscilloscope to observe the CAN_H and CAN_L signals and verify that they show the expected voltage levels and that the differential voltage represents the data being transmitted. This hardware verification step is important because it eliminates the physical layer as a source of problems when we later debug our IDS implementation.

6.2 Attacker Firmware Architecture and State Machine Implementation
The attacker firmware, which we have designated with the somewhat playful name "evil_doggie," is designed to simulate the behavior of a compromised Electronic Control Unit that has been taken over by an adversary. While the name may be whimsical, the functionality it implements represents a serious threat that could have severe consequences in a real vehicle environment. The purpose of this firmware is educational: by demonstrating how easily a malicious node can disrupt CAN communications, we illustrate the critical need for the defensive mechanisms that our IDS provides.
The architecture of the attacker firmware is built around a state machine that controls the attack behavior. State machines are a fundamental design pattern in embedded systems, particularly appropriate here because they provide a clear, maintainable way to manage the different operational modes of the attacker. The state machine approach also makes it easy to extend the firmware in the future to implement additional attack types beyond the flooding attack we currently demonstrate.
The state machine begins in an IDLE state when the system powers up. In this state, the firmware initializes the hardware peripherals, including the TWAI controller and the serial console interface, but does not transmit any messages on the CAN bus. The system remains passive, allowing observation of normal bus traffic. This idle state is important for two reasons. First, it allows us to establish baseline measurements of normal network behavior before launching an attack. Second, it demonstrates that the attack is under operator control rather than being automatically triggered on power-up, which would make experimentation more difficult.
From the IDLE state, the operator can issue a command through the serial console to transition to the FLOOD state. This command might be as simple as typing "attack start" or pressing a designated key. When the state machine enters the FLOOD state, the attack begins immediately. The firmware constructs a CAN frame with the highest priority identifier, zero x zero zero zero, and fills the data field with eight bytes of arbitrary data. We use the value zero x F F for all data bytes, though the actual payload content is irrelevant for the denial-of-service effect we are creating. The frame is then queued for transmission to the TWAI controller.
The critical aspect of the flooding attack implementation is maintaining continuous transmission without gaps. As soon as the TWAI controller completes transmission of one frame and signals this completion through an interrupt or status flag, the firmware immediately constructs and queues the next frame. This tight loop ensures that the bus is continuously occupied by our high-priority messages, giving legitimate nodes no opportunity to win arbitration and transmit their own messages.
However, there is one practical consideration we must handle: the finite size of the TWAI controller's transmit buffer. The ESP32's TWAI peripheral can queue a small number of frames for transmission, but if our software attempts to queue frames faster than the hardware can transmit them, the buffer will overflow. Our implementation handles this by checking the buffer status before attempting to queue each frame. If the buffer is full, indicated by a TxBufferFull error, the code enters a brief busy-wait loop, repeatedly checking the status until space becomes available. In practice, at five hundred kilobits per second, the hardware can transmit frames fast enough that this busy-wait rarely occurs, but including this check prevents the firmware from losing track of frames or entering an error state.
The firmware also implements a FLOOD_STOP state that can be entered by operator command. In this state, the continuous transmission of attack frames ceases, but the system does not immediately return to IDLE. Instead, it remains in FLOOD_STOP to allow observation of how the network recovers after the attack ends. This is valuable for understanding the resilience characteristics of the system and for debugging the IDS behavior. From FLOOD_STOP, another command can transition back to IDLE, completing the state cycle.
Attacker State Machine Diagram

                    ┌──────────┐
         Power On   │          │
            ────────▶   IDLE   │
                    │          │
                    └─────┬────┘
                          │
                "attack"  │
                 command  │
                          ▼
                    ┌──────────┐
                    │  FLOOD   │◀─────┐
                    │          │      │
                    └─────┬────┘      │
                          │           │
                          │    Transmit loop:
                 "stop"   │    - Build frame (ID: 0x000)
                 command  │    - Queue to TWAI
                          │    - Check buffer status
                          │           │
                          ▼           │
                    ┌──────────┐      │
                    │FLOOD_STOP│──────┘
                    │          │
                    └─────┬────┘
                          │
                 "reset"  │
                 command  │
                          ▼
                    ┌──────────┐
                    │   IDLE   │
                    └──────────┘
The implementation in Rust leverages the type system and pattern matching to make the state machine both safe and maintainable. We define an enumeration type representing the possible states, and use pattern matching to handle the transitions and behaviors associated with each state. The Rust compiler ensures that we handle all possible states and that state transitions are explicit and type-safe. This eliminates entire categories of bugs that might occur in a C implementation using integer state variables and if-else chains.
The serial console interface deserves special mention, as it provides the human-machine interface for controlling the attacker. We implement a simple command-line interface that accepts text commands over the USB serial connection. The operator can type commands to view the current state, trigger state transitions, or query statistics about how many frames have been transmitted. This interface is implemented as a separate asynchronous task that runs concurrently with the attack logic, demonstrating Embassy's ability to manage multiple concurrent operations. The serial task waits for incoming characters, accumulates them into a buffer until a newline is received, parses the resulting command string, and then triggers the appropriate state transition or action.
6.3 Defense Module Implementation: IDS Architecture
The Intrusion Detection System represents the core contribution of this project. While the attacker firmware demonstrates a known vulnerability, the IDS firmware shows that effective defense is possible even on resource-constrained embedded systems. The IDS implementation combines multiple detection techniques into a cohesive system that can identify and respond to flooding attacks in real-time.
The overall architecture of the IDS is designed as a modular pipeline that processes each incoming CAN frame through a series of inspection stages. This pipeline architecture makes the system extensible—new detection algorithms can be added as additional pipeline stages—and maintainable, as each stage has a well-defined interface and responsibility. The pipeline is implemented within the receive path of the firmware, so every frame that arrives from the CAN bus passes through the IDS before being delivered to the application layer for processing.
The first stage of the pipeline is signature-based detection using a blocklist. The IDS maintains a small array of message identifiers that have been flagged as suspicious or malicious. When a frame enters the IDS pipeline, the first check is a simple lookup: is this frame's identifier present in the blocklist? If so, the frame is immediately rejected, and no further processing occurs. This provides fast, deterministic protection against known malicious identifiers.
The blocklist itself is implemented as a fixed-size array stored in the microcontroller's RAM. For our demonstration system, we allocate space for up to sixteen blocked identifiers, which is more than sufficient for the attack scenarios we demonstrate but small enough that the linear search through the array completes in a few microseconds. In a production system, the size might be adjusted based on the expected threat model and available memory. The blocklist is initially empty when the system boots, and identifiers are added dynamically by other components of the IDS as suspicious behavior is detected.
The second major component of the IDS is the anomaly-based frequency analysis engine. This component monitors the rate at which messages appear on the bus, specifically looking for the abnormally high transmission rates characteristic of a flooding attack. The challenge is to detect flooding quickly, with low latency, while avoiding false positives from legitimate bursts of traffic that might occur during normal vehicle operation.
Our frequency analysis uses a sliding window algorithm with time-based bucketing. We maintain a small buffer that records the timestamps of recently received frames, organized by message identifier. When a new frame arrives, we examine the timestamps of previous frames with the same identifier. If we find that more than a threshold number of frames with this identifier have been received within a defined time window, we conclude that a flooding attack is in progress, and the identifier is added to the blocklist.
The specific parameters of the sliding window require careful tuning. The window size represents the time period over which we count messages. Too short a window might trigger false positives from brief legitimate bursts. Too long a window increases detection latency, allowing the attack to continue longer before being identified. Through experimentation with our testbed, we found that a window of one hundred milliseconds provides a good balance. The threshold count similarly requires tuning. We set the threshold at fifty messages per window, reasoning that no legitimate message in a typical vehicle network should appear at rates exceeding five hundred hertz. A flooding attack, which aims for maximum bus utilization, will easily exceed this threshold within the first window period.
IDS Processing Pipeline

Incoming CAN Frame
      │
      ▼
┌──────────────────┐
│ Frame Reception  │
│ (TWAI Hardware)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│  Stage 1: Blocklist      │
│  Check                   │
│  - Is ID in blocklist?   │
│  - If YES → DROP         │
│  - If NO → Continue      │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Stage 2: Frequency      │
│  Analysis                │
│  - Count msgs in window  │
│  - Exceeds threshold?    │
│  - If YES → Add to block │
│            → DROP        │
│  - If NO → Continue      │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Stage 3: Application    │
│  Delivery                │
│  - Process frame data    │
│  - Update vehicle state  │
└──────────────────────────┘
The implementation of the sliding window in Rust makes use of the language's powerful iterator and collection abstractions. We store timestamps in a circular buffer, and when checking for flooding, we use iterator methods to filter timestamps within the window and count them. The Rust standard library provides these operations with excellent performance, and the compiler's optimizations ensure that the generated code is as efficient as hand-written C would be.
A crucial aspect of the IDS implementation is its real-time performance characteristics. The CAN bus operating at five hundred kilobits per second can deliver approximately three thousand eight hundred frames per second in the case of minimum-length frames, though typical traffic is much lower. Our IDS must process each frame with latency low enough that the receive buffer does not overflow. We achieve this through careful algorithm design and by leveraging the hardware acceleration provided by the TWAI controller's acceptance filters.
The TWAI controller includes hardware filtering capability that can reject frames based on their identifiers before they are even placed in the receive buffer. We configure these hardware filters to immediately reject any identifiers in our blocklist, providing the fastest possible rejection with zero software overhead. When an identifier is added to the software blocklist by the frequency analysis engine, we also update the hardware filters to maintain consistency. This two-level filtering approach—hardware filters for speed, software analysis for intelligence—provides both performance and flexibility.
6.4 Traffic Monitoring and Statistical Analysis
Beyond the core intrusion detection algorithms, the IDS firmware implements comprehensive traffic monitoring and statistical analysis capabilities. These features serve multiple purposes: they provide visibility into network behavior for debugging and research, they generate the metrics needed to tune detection thresholds, and they enable automated reporting that could alert human operators to security events in a production deployment.
The statistics module tracks several key metrics for each active message identifier observed on the bus. For each ID, we record the total number of frames received, the timestamp of the first and most recent frame, the minimum and maximum inter-arrival times between consecutive frames, and the current estimated transmission frequency. These statistics are updated in real-time as frames are processed, with minimal computational overhead.
The frequency estimation deserves particular attention because it feeds directly into the anomaly detection logic. A naive approach would simply count the number of frames received in some fixed time period and divide by the period duration. However, this approach has poor responsiveness to changing conditions—the estimate only updates when each time period expires. We instead use an exponentially weighted moving average, or EWMA, which provides continuous updates and emphasizes recent observations while smoothly incorporating historical data.
The EWMA calculation works as follows: when a frame arrives, we calculate the time delta since the previous frame with the same identifier. We then compute the instantaneous frequency as one divided by this delta. The estimated frequency is then updated as a weighted average of the previous estimate and this new instantaneous measurement, with the weighting factor determining how quickly the estimate adapts to changes. This gives us a frequency estimate that responds quickly to flooding attacks while filtering out noise from minor variations in transmission timing.
The statistical data is accessible through the serial console interface, allowing operators to query current metrics at any time. We implement commands to display statistics for all active identifiers, to show detailed information about a specific identifier, or to dump the complete blocklist. This visibility is invaluable during development and testing, as it allows us to verify that the IDS is correctly observing traffic and applying detection logic. In a production deployment, these statistics might be logged to non-volatile storage or transmitted over a secure channel to a central security monitoring system.
6.5 Response Mechanisms and Attack Mitigation
Detecting an attack is only the first step; the IDS must also respond appropriately to mitigate the attack's impact and restore normal network operation. Our system implements several response mechanisms that activate when malicious traffic is identified.
The immediate response to detecting a flooding attack is to add the offending identifier to the blocklist, preventing further frames with that identifier from being processed. This blocking action happens within milliseconds of the attack detection, minimizing the period during which the attack can affect the system. Once blocked, frames with that identifier are rejected at the hardware level by the TWAI controller's acceptance filters, ensuring they consume minimal system resources.
However, simply blocking frames is not always sufficient, particularly in the case of a sophisticated attacker who might rotate through multiple identifiers or who might be flooding the bus so aggressively that even rejected frames impact performance. For these scenarios, we implement a more aggressive response: actively transmitting error frames to disrupt the attacker's transmissions.
CAN error frames are a special frame type defined in the protocol for signaling that an error has been detected. When a node detects an error during frame reception or transmission, it transmits an error frame consisting of six consecutive dominant bits, violating the bit stuffing rule and thus signaling all other nodes that an error has occurred. We can exploit this mechanism defensively by deliberately transmitting error frames when we detect attack traffic, forcing the attacking node to abort its transmission and retry.
This active response must be used judiciously, as excessive error frame transmission can itself disrupt legitimate traffic. Our implementation only activates the error frame response when the frequency analysis conclusively identifies a flooding attack in progress, and we rate-limit the error frames to avoid creating a new denial-of-service condition. The goal is to increase the cost and difficulty of the attack for the adversary while minimizing impact on legitimate network participants.
The final layer of response is alerting and reporting. When the IDS detects and responds to an attack, it generates detailed log entries that record the identifier of the malicious frames, the timestamp when the attack was detected, the characteristics that triggered detection, and the actions taken in response. These logs are transmitted over the serial interface in real-time and could also be stored in the ESP32's flash memory for later forensic analysis.
For critical security events, the IDS can also trigger visual or auditory alarms. In our testbed implementation, we simply flash an LED on the ESP32 development board when an attack is detected. In a vehicle deployment, this alert mechanism might illuminate a warning light on the dashboard or trigger an audible alert to notify the driver of a potential security compromise. The alert system is designed to be extensible, with a clear interface that allows additional alerting mechanisms to be added without modifying the core IDS logic.
6.6 Integration Testing and Validation Methodology
Before conducting formal experiments, we perform extensive integration testing to validate that all components of the system work correctly together. This testing phase is critical for identifying and resolving issues that might not be apparent when testing individual components in isolation.
The first phase of integration testing focuses on basic connectivity and communication. We load simple test firmware on all three nodes and verify that they can successfully exchange messages. We start with just two nodes, configuring one as a transmitter sending periodic heartbeat messages and the other as a receiver logging all received frames. Once we confirm reliable two-node communication, we add the third node and verify that all three can see each other's traffic. This establishes confidence in the physical layer implementation before we introduce the complexity of the attack and defense mechanisms.
Next, we test the attacker firmware in isolation. We load the evil_doggie firmware on one node and observe its behavior using a CAN bus analyzer, a specialized tool that connects to the bus and displays all traffic. We verify that in the IDLE state, the attacker transmits nothing. We trigger the transition to FLOOD state and confirm that the node begins continuously transmitting frames with identifier zero x zero zero zero. We measure the achieved transmission rate and verify that it matches our theoretical calculations for maximum bus utilization. We also observe the behavior of the other nodes during the attack, confirming that they lose arbitration and are unable to transmit.
With confidence in the attacker firmware, we proceed to test the IDS firmware. We load the IDS firmware on the receiver node and initially test it with normal, non-attack traffic. We verify that legitimate messages are correctly received and processed, and that the statistics module accurately tracks traffic metrics. We intentionally vary the transmission patterns—sending bursts of messages, varying the identifiers, changing the data rates—to ensure the IDS does not generate false positives under normal operating conditions.
The critical integration test combines all three nodes: sender, receiver with IDS, and attacker. We establish normal traffic patterns with the sender transmitting periodic messages. We verify that the IDS receiver successfully receives these messages and that statistics indicate normal operation. We then activate the attacker and observe the IDS response. Successful operation is indicated by the IDS detecting the flood within the expected latency window, adding the malicious identifier to the blocklist, and continuing to operate normally despite the ongoing attack. We verify that the sender node, protected by the IDS's actions, can still communicate, or at least degrades gracefully rather than entering bus-off state.
Throughout integration testing, we pay particular attention to edge cases and failure modes. What happens if two nodes attempt to flood simultaneously? How does the IDS behave if it itself is flooded with legitimate traffic from many identifiers, exhausting its statistical tracking resources? Can an attacker craft attack patterns that exploit weaknesses in the detection algorithm? These adversarial test cases help us identify and address vulnerabilities in our defense mechanisms.
We also conduct performance testing to quantify the computational overhead of the IDS. Using the ESP32's built-in timing facilities, we measure the CPU time consumed by IDS processing for each frame. We vary the traffic load from light (a few messages per second) to heavy (approaching maximum bus capacity) and measure how the processing time scales. We monitor memory usage to ensure we are not approaching the limits of the available RAM. These performance measurements give us confidence that the IDS can operate reliably in the demanding real-time environment of an automotive network, and they identify any bottlenecks that might need optimization.
Integration Test Sequence

Phase 1: Physical Layer Validation
  ├─ Two-node ping-pong test
  ├─ Three-node broadcast test
  └─ Signal integrity verification
       └─ PASS: All nodes communicate reliably

Phase 2: Attacker Validation
  ├─ State machine transitions
  ├─ Flood transmission rate measurement
  └─ Impact on victim nodes
       └─ PASS: Attack achieves bus saturation

Phase 3: IDS Baseline Testing
  ├─ Normal traffic processing
  ├─ Statistics accuracy
  └─ False positive rate
       └─ PASS: No false positives in 1-hour test

Phase 4: Complete System Test
  ├─ Establish normal traffic baseline
  ├─ Activate flooding attack
  ├─ Measure IDS detection latency
  ├─ Verify attack mitigation
  └─ Confirm system recovery
       └─ PASS: Detection <15ms, effective mitigation

Phase 5: Edge Case Testing
  ├─ Simultaneous attacks from multiple IDs
  ├─ Resource exhaustion scenarios
  ├─ Rapid attack on/off cycling
  └─ Combined attack + legitimate traffic
       └─ Results documented for algorithm tuning
The integration testing phase typically reveals issues that were not apparent in unit testing. For example, we discovered during testing that our initial frequency threshold was too sensitive, triggering false positives when the sender node transmitted bursts of messages in response to simulated events. We adjusted the threshold based on empirical data from these tests. We also found that the initial implementation of the blocklist had a race condition when the frequency analyzer and the hardware filter update logic accessed the list concurrently. Rust's borrow checker actually prevented us from compiling this buggy code, demonstrating the value of the language's safety guarantees.
By the time we complete integration testing, we have high confidence that the system operates correctly and robustly. We have characterized its performance, we understand its limitations, and we have validated its core functionality: the ability to detect and mitigate CAN bus flooding attacks in real-time. With this foundation established, we are ready to proceed to formal experimental evaluation and performance measurement, which we will detail in the following chapters. The systematic approach to integration testing, combined with Rust's compile-time safety guarantees, gives us assurance that the results we obtain in formal testing will be reliable and reproducible


###