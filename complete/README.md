# Chat WebSocket sobre RabbitMQ (STOMP broker relay)

El broker en memoria (`enableSimpleBroker`) fue reemplazado por RabbitMQ con `enableStompBrokerRelay`.

## Ejecutar
```bash
docker compose up -d          # RabbitMQ: AMQP 5672, STOMP 61613, panel http://localhost:15672 (guest/guest)
./mvnw spring-boot:run
```
Abrir `http://localhost:8080` en dos pestañas y chatear.

## Configuración
- `pom.xml`: `spring-boot-starter-amqp`, `spring-boot-starter-websocket`, `spring-boot-starter-reactor-netty`.
- `WebSocketConfig`: relay a `localhost:61613`, prefijo de aplicación `/app`, endpoint SockJS `/ws`.
- `application.yaml`: RabbitMQ en `localhost:5672`.
- `compose.yaml`: imagen `rabbitmq:management` con el plugin `rabbitmq_stomp` habilitado.
- `ChatController`: `/app/chat.addUser` y `/app/chat.sendMessage` publican en `/topic/public`.
- `Runner`/`Receiver`: demo AMQP (envía y recibe un mensaje al arrancar).
