from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class ClienteBase(SQLModel):
    nombre: str
    email: str = Field(unique=True, index=True)

class Cliente(ClienteBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    pedidos: List["Pedido"] = Relationship(back_populates="cliente")

class ClienteCreate(ClienteBase):
    pass

class ClienteUpdate(SQLModel):
    nombre: Optional[str] = None
    email: Optional[str] = None

class PedidoBase(SQLModel):
    descripcion: str
    monto: float
    cliente_id: int = Field(foreign_key="cliente.id")

class Pedido(PedidoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    cliente: Optional[Cliente] = Relationship(back_populates="pedidos")

class PedidoCreate(PedidoBase):
    pass

class PedidoUpdate(SQLModel):
    descripcion: Optional[str] = None
    monto: Optional[float] = None