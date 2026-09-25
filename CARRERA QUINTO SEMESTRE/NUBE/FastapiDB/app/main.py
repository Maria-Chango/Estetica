from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from sqlmodel import Session, select
from app.database import init_db, get_session
from app.models import (
    Cliente, ClienteCreate, ClienteUpdate,
    Pedido, PedidoCreate, PedidoUpdate
)

app = FastAPI(title="API de Gestión de Clientes y Pedidos")

@app.on_event("startup")
def on_startup():
    init_db()

# --- CRUD CLIENTES ---
@app.post("/clientes/", response_model=Cliente, status_code=status.HTTP_201_CREATED)
def crear_cliente(cliente: ClienteCreate, session: Session = Depends(get_session)):
    db_cliente = Cliente.model_validate(cliente)
    session.add(db_cliente)
    session.commit()
    session.refresh(db_cliente)
    return db_cliente

@app.get("/clientes/", response_model=List[Cliente])
def listar_clientes(session: Session = Depends(get_session)):
    return session.exec(select(Cliente)).all()

@app.get("/clientes/{cliente_id}", response_model=Cliente)
def obtener_cliente(cliente_id: int, session: Session = Depends(get_session)):
    cliente = session.get(Cliente, cliente_id)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente

@app.put("/clientes/{cliente_id}", response_model=Cliente)
def actualizar_cliente(cliente_id: int, cliente_data: ClienteUpdate, session: Session = Depends(get_session)):
    db_cliente = session.get(Cliente, cliente_id)
    if not db_cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    datos = cliente_data.model_dump(exclude_unset=True)
    for key, value in datos.items():
        setattr(db_cliente, key, value)
    session.add(db_cliente)
    session.commit()
    session.refresh(db_cliente)
    return db_cliente

@app.delete("/clientes/{cliente_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_cliente(cliente_id: int, session: Session = Depends(get_session)):
    cliente = session.get(Cliente, cliente_id)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    session.delete(cliente)
    session.commit()

# --- CRUD PEDIDOS ---
@app.post("/pedidos/", response_model=Pedido, status_code=status.HTTP_201_CREATED)
def crear_pedido(pedido: PedidoCreate, session: Session = Depends(get_session)):
    db_pedido = Pedido.model_validate(pedido)
    session.add(db_pedido)
    session.commit()
    session.refresh(db_pedido)
    return db_pedido

@app.get("/pedidos/", response_model=List[Pedido])
def listar_pedidos(session: Session = Depends(get_session)):
    return session.exec(select(Pedido)).all()

@app.get("/pedidos/{pedido_id}", response_model=Pedido)
def obtener_pedido(pedido_id: int, session: Session = Depends(get_session)):
    pedido = session.get(Pedido, pedido_id)
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return pedido

@app.put("/pedidos/{pedido_id}", response_model=Pedido)
def actualizar_pedido(pedido_id: int, pedido_data: PedidoUpdate, session: Session = Depends(get_session)):
    db_pedido = session.get(Pedido, pedido_id)
    if not db_pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    datos = pedido_data.model_dump(exclude_unset=True)
    for key, value in datos.items():
        setattr(db_pedido, key, value)
    session.add(db_pedido)
    session.commit()
    session.refresh(db_pedido)
    return db_pedido

@app.delete("/pedidos/{pedido_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_pedido(pedido_id: int, session: Session = Depends(get_session)):
    pedido = session.get(Pedido, pedido_id)
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    session.delete(pedido)
    session.commit()