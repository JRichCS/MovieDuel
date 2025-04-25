# --------- FRONTEND BUILD STAGE ---------
    FROM node:18 AS frontend

    WORKDIR /MERNSkeleton/frontend
    COPY frontend/package*.json ./
    RUN npm install --verbose
    COPY frontend/ ./
    RUN npm run build
    
    # --------- BACKEND BUILD STAGE ---------
    FROM node:18
    
    WORKDIR /MERNSkeleton
    
    # Copy the backend package.json files (backend and server)
    COPY backend/package*.json ./backend/
    COPY backend/server/package*.json ./backend/server/
    
    # Debugging: Check if the directory exists after copying
    RUN echo "Checking backend directory:" && ls -la /MERNSkeleton/
    RUN echo "Checking backend directory structure:" && ls -la /MERNSkeleton/backend/
    RUN echo "Checking server directory structure:" && ls -la /MERNSkeleton/backend/server/
    
    # Install backend dependencies
    RUN cd backend && npm install --verbose
    RUN cd backend/server && npm install --verbose
    
    # Copy the backend files
    COPY backend/ ./backend/
    COPY backend/server/ ./backend/server/
    
    # Copy built frontend into the backend public dir
    COPY --from=frontend /MERNSkeleton/frontend/build ./public
    
    EXPOSE 8080
    EXPOSE 8081
    
    CMD ["node", "backend/server/server.js"]
    