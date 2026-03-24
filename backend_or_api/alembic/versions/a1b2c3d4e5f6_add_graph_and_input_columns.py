"""add graph and input columns

Revision ID: a1b2c3d4e5f6
Revises: 910fe74a5346
Create Date: 2026-03-24 22:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, Sequence[str], None] = "910fe74a5346"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("runrecord", sa.Column("graph", sa.JSON(), nullable=True))
    op.add_column("runnodeoutput", sa.Column("input", sa.JSON(), nullable=True))


def downgrade() -> None:
    op.drop_column("runnodeoutput", "input")
    op.drop_column("runrecord", "graph")
