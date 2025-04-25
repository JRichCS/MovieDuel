# --------- FRONTEND BUILD STAGE ---------
    FROM node:18 AS frontend

    WORKDIR /MERNSkeleton/frontend
    COPY frontend/package*.json ./
    RUN npm install
    COPY frontend/ ./
    RUN npm run build
    
    # --------- BACKEND BUILD STAGE ---------
    FROM node:18
    
    WORKDIR /MERNSkeleton
    COPY backend/package*.json ./
    RUN npm install
    COPY backend/ ./
    
    # Copy built frontend files into backend (assuming you're serving them via Express)
    COPY --from=frontend /MERNSkeleton/frontend/build ./public
    
    EXPOSE 8080
    EXPOSE 8081
    
    CMD ["node", "server.js"]
    